import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import * as console from "console";
import {UtilService} from "../util/util.service";
import {UserDto} from "./dto/user.dto";
import {Exception} from "../response/error";
import { SignupDataDto } from './dto/signupData.dto';
import {UserWithWriterInfo} from "./scheme/user.scheme";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {ExceptionList} from "../response/error/errorInstances";
import {UserLocalLoginDto} from "./dto/userLocalLogin.dto";
import {UserAccessTokensDto} from "./dto/userAccessTokens.dto";
import {UserUniqueDataDto} from "./dto/userUniqueData.dto";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService, private readonly utilService: UtilService) {}

    /**
     * @summary user의 가입 정보 중 중복되는 것 에러 발생
     * @param userData
     * @throws EMAIL_ALREADY_EXIST
     * @throws NICKNAME_ALREADY_EXIST
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     */
    async assertUserDataUnique(userData : UserUniqueDataDto){
        await this.assertEmailUnique(userData.email);
        await this.assertNicknameUnique(userData.nickname)
        if(userData.moonjinEmail)
            await this.assertMoonjinEmailUnique(userData.moonjinEmail)
    }

    /**
     * @summary email이 unique 한지 확인
     * @param email
     * @throws EMAIL_ALREADY_EXIST
     */
    async assertEmailUnique(email : string) : Promise<void>{
        const user = await this.prismaService.user.findUnique({
            where:{
                email
            }
        })
        if(user) throw ExceptionList.EMAIL_ALREADY_EXIST;
    }
    /**
     * @summary nickname이 unique 한지 확인
     * @param nickname
     * @throws NICKNAME_ALREADY_EXIST
     */
    async assertNicknameUnique(nickname : string) : Promise<void>{
        const user = await this.prismaService.user.findUnique({
            where:{
                nickname
            }
        })
        if(user) throw ExceptionList.NICKNAME_ALREADY_EXIST;
    }
    /**
     * @summary moonjinEmail이 unique 한지 확인
     * @param moonjinEmail
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     */
    async assertMoonjinEmailUnique(moonjinEmail : string) : Promise<void>{
        const user = await this.prismaService.writerInfo.findUnique({
            where:{
                moonjinEmail
            }
        })
        if(user) throw ExceptionList.MOONJIN_EMAIL_ALREADY_EXIST;
    }


    /**
     * @summary 작가 | 독자의 회원가입을 진행하는 기능
     *
     * @param signUpData
     * @returns UserDto | WriterDto
     * @throws MAIL_ALREADY_EXIST
     * @throws NICKNAME_ALREADY_EXIST
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     * @throws SIGNUP_ERROR
     * @throws WRITER_SIGNUP_ERROR
     */
    async localSignUp(signUpData : SignupDataDto): Promise<UserDto> {
        try {
            signUpData.password = this.utilService.getHashCode(signUpData.password);
            const {moonjinEmail, ...data} = signUpData;
            if (moonjinEmail) { // 작가 회원가입
                const createdWriter:UserWithWriterInfo = await this.prismaService.user.create({
                    data: {
                        ...data,
                        writerInfo: {
                            create: {
                                moonjinEmail
                            }
                        }
                    },
                    include: {
                        writerInfo: true
                    }
                })
                const {writerInfo, createdAt, deletedAt,password, ...createdUser} = createdWriter;
                if(writerInfo)
                    return createdUser
                else
                    throw ExceptionList.WRITER_SIGNUP_ERROR;
            }else{ // 독자 회원가입
                const createdUser : User = await this.prismaService.user.create({data});
                const {deletedAt, createdAt, password ,...userData} = createdUser;
                return userData;
            }
        }catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code == "P2002" && error.meta){
                    const errorField = (error.meta.target as string[])[0]
                    switch (errorField){
                        case "email":
                            throw ExceptionList.EMAIL_ALREADY_EXIST;
                        case "nickname":
                            throw ExceptionList.NICKNAME_ALREADY_EXIST;
                        case "moonjinEmail":
                            throw ExceptionList.MOONJIN_EMAIL_ALREADY_EXIST;
                    }
                }
            }
            else if(error instanceof Exception){
                throw error;
            }
            console.error(error)
            throw ExceptionList.SIGNUP_ERROR;
        }
    }

    /**
     * @summary 로컬 로그인을 진행하는 함수
     * @param loginData 로그인할 유저 정보
     * @returns UserDto
     * @throws SOCIAL_USER_ERROR
     * @throws INVALID_PASSWORD
     * @throws USER_NOT_FOUND
     * @throws LOGIN_ERROR
     */
    async localLogin(loginData : UserLocalLoginDto) : Promise<UserDto> {
        try {
            const user : User | null = await this.prismaService.user.findUnique({
                where:{
                    email: loginData.email,
                }
            })
            if(user){
                if(!user.password) { // 소셜 유저
                    throw ExceptionList.SOCIAL_USER_ERROR;
                } else{
                    const {deletedAt, createdAt, password,...userData} = user;
                    const isValidPassword = this.utilService.compareHash(loginData.password, password)
                    if (isValidPassword)
                        return userData;
                    else
                        throw ExceptionList.INVALID_PASSWORD;
                }
            } else{
                throw ExceptionList.USER_NOT_FOUND;
            }
        } catch (error) {
            console.error(error)
            if(error instanceof PrismaClientKnownRequestError){
                throw ExceptionList.LOGIN_ERROR;
            }
            throw error;
        }
    }

    /**
     * @summary 해당 하는 유저를 삭제.
     * @param id 유저 id
     * @param role 작가라면 작가 정보도 삭제
     */
    async deleteUserById(id: number, role: number): Promise<void>{
        try {
            console.log(id,role);
            if(role > 0){
                this.prismaService.writerInfo.delete({
                    where:{
                        userId : id
                    }
                })
            }
            await this.prismaService.user.delete({
                where : {
                    id : id
                },
            })
        } catch (error){
            console.error(error)
        }
    }

    getAccessTokens(userData: UserDto) : UserAccessTokensDto {
        const accessToken = this.utilService.generateJwtToken(userData,60 * 15);
        const refreshToken = this.utilService.generateJwtToken(userData, 60 * 60 * 24 * 7);
        return {accessToken, refreshToken}
    }
}

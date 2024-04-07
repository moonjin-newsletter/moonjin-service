import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import * as console from "console";
import {UtilService} from "../util/util.service";
import {
    UserAuthDto,
    SignupDataDto,
    LocalLoginDto,
    UserAccessTokensDto,
    WriterSignupDto,
    WriterInfoDto,
    SocialSignupDto
} from "./dto";
import {Exception} from "../response/error/error";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {ExceptionList} from "../response/error/errorInstances";
import {UserRoleEnum} from "./enum/userRole.enum";
import UserDtoMapper from "../user/userDtoMapper";
import { JwtService } from '@nestjs/jwt';
import {OauthService} from "./oauth.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly jwtService: JwtService,
        private readonly oauthService: OauthService
    ) {}

    /**
     * @summary 작가 | 독자의 회원가입을 진행하는 기능
     *
     * @param signUpData
     * @returns UserAuthDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws NICKNAME_ALREADY_EXIST
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     * @throws SIGNUP_ERROR
     * @throws WRITER_SIGNUP_ERROR
     */
    async localSignUp(signUpData : SignupDataDto): Promise<UserAuthDto> {
        let userId = 0;
        try {
            const defaultProfile = process.env.CDN_URL + '/profile/default.png';
            const {moonjinId, hashedPassword ,...data} = signUpData;
            // 공통 회원가입
            const createdUser : User = await this.prismaService.user.create({
                data : {
                    ...data,
                    image : defaultProfile,
                    password : hashedPassword,
                    createdAt : this.utilService.getCurrentDateInKorea()
                }
            });
            userId = createdUser.id;
            if (signUpData.role === UserRoleEnum.WRITER && moonjinId){ // 작가 회원가입
                await this.writerSignup({userId, moonjinId});
            }
            return UserDtoMapper.UserToUserAuthDto(createdUser);
        }catch(error){
            if(userId > 0){ // writerSignup Error : user가 생성되었으니 transaction rollback
                await this.prismaService.user.delete({
                    where:{
                        id : userId
                    }
                })
                throw error;
            }
            this.prismaSignupErrorHandling(error);
            if(error instanceof Exception){
                throw error;
            }
            console.error(error)
            throw ExceptionList.SIGNUP_ERROR;
        }
    }

    /**
     * @summary 작가 회원가입을 진행하는 함수
     * @param writerSignupData
     * @returns WriterInfoDto
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     * @throws WRITER_SIGNUP_ERROR
     */
    async writerSignup(writerSignupData : WriterSignupDto) : Promise<WriterInfoDto>{
        try {
            const writerInfo = await this.prismaService.writerInfo.create({
                data:{
                    ...writerSignupData,
                    createdAt : this.utilService.getCurrentDateInKorea()
                }
            })
            return UserDtoMapper.WriterInfoToWriterInfoDto(writerInfo);
        } catch (error){
            if(error instanceof PrismaClientKnownRequestError){
                throw ExceptionList.MOONJIN_EMAIL_ALREADY_EXIST;
            }
            throw ExceptionList.WRITER_SIGNUP_ERROR;
        }
    }

    /**
     * @summary 비밀번호 변경
     * @param id
     * @param password
     * @throws SOCIAL_USER_ERROR
     * @throws PASSWORD_CHANGE_ERROR
     * @returns void
     */
    async passwordChange(id : number, password : string): Promise<void> {
        await this.oauthService.assertUserNotSocial(id);
        try {
            await this.prismaService.user.update({
                where:{
                    id,
                    deleted : false
                },
                data:{
                    password : this.utilService.getHashCode(password)
                }
            })
        } catch (error){
            console.error(error)
            throw ExceptionList.PASSWORD_CHANGE_ERROR;
        }
    }

    async getUserByEmail(email : string): Promise<UserAuthDto | null> {
        const user = await this.prismaService.user.findUnique({
            where:{
                email,
                deleted : false
            }
        })
        return user ? UserDtoMapper.UserToUserAuthDto(user) : null;
    }

    /**
     * @summary 로컬 로그인을 진행하는 함수
     * @param loginData 로그인할 유저 정보
     * @returns UserDto | WriterDto
     * @throws SOCIAL_USER_ERROR
     * @throws INVALID_PASSWORD
     * @throws USER_NOT_FOUND
     * @throws LOGIN_ERROR
     */
    async localLogin(loginData : LocalLoginDto) : Promise<UserAuthDto> {
        try {
            const user = await this.prismaService.user.findUnique({
                where:{
                    email: loginData.email,
                }
            })
            if(!user)
                throw ExceptionList.USER_NOT_FOUND;
            if(!user.password) // 소셜 유저
                throw ExceptionList.SOCIAL_USER_ERROR;
            if (!this.utilService.compareHash(loginData.password, user.password)) // 비밀번호 틀림
                throw ExceptionList.INVALID_PASSWORD;

            return UserDtoMapper.UserToUserAuthDto(user);
        } catch (error) {
            console.error(error)
            if(error instanceof PrismaClientKnownRequestError){
                throw ExceptionList.LOGIN_ERROR;
            }
            throw error;
        }
    }


    /**
     * @summary 소셜 회원가입을 진행하는 함수
     * @param socialSignupData
     * @returns UserDto | WriterDto
     * @throws SOCIAL_SIGNUP_ERROR
     * @throws EMAIL_ALREADY_EXIST
     * @throws NICKNAME_ALREADY_EXIST
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     */
    async socialSignup(socialSignupData : SocialSignupDto): Promise<UserAuthDto> {
        let createdUserId = 0
        let createdOauthId = ""
        const image = this.utilService.processImageForProfile(socialSignupData.image)
        try {
            const {oauthId, social, moonjinId, ...userSignupData} = socialSignupData;
            const createdUser = await this.prismaService.user.create({
                data: {
                    ...userSignupData,
                    image,
                    createdAt : this.utilService.getCurrentDateInKorea()
                }
            })
            createdUserId = createdUser.id;
            const createdOauth = await this.oauthService.oauthSignup({oauthId, social, userId: createdUser.id});
            createdOauthId = createdOauth.oauthId
            if(userSignupData.role === UserRoleEnum.WRITER && moonjinId){ // 작가 회원가입
                await this.writerSignup({userId: createdUser.id, moonjinId});
            }
            return UserDtoMapper.UserToUserAuthDto(createdUser)
        } catch (error){
            if(createdOauthId){ // transaction rollback
                await this.prismaService.oauth.delete({
                    where:{
                        oauthId : createdOauthId
                    }
                })
            }
            if(createdUserId > 0){ // transaction rollback
                await this.prismaService.user.delete({
                    where:{
                        id : createdUserId
                    }
                })
            }
            this.prismaSignupErrorHandling(error);
            console.error(error);
            throw ExceptionList.SOCIAL_SIGNUP_ERROR;
        }
    }

    /**
     * @summary prisma 에서 signup 시 에러를 처리하는 함수
     * @param error
     * @throws EMAIL_ALREADY_EXIST
     * @throws NICKNAME_ALREADY_EXIST
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     * @throws SIGNUP_ERROR
     */
    prismaSignupErrorHandling(error : Error){
        if (error instanceof PrismaClientKnownRequestError){
            if (error.code == "P2002" && error.meta){
                const errorField = (error.meta.target as string[])[0]
                switch (errorField){
                    case "email":
                        throw ExceptionList.EMAIL_ALREADY_EXIST;
                    case "nickname":
                        throw ExceptionList.NICKNAME_ALREADY_EXIST;
                    case "moonjinId":
                        throw ExceptionList.MOONJIN_EMAIL_ALREADY_EXIST;
                    default:
                        throw ExceptionList.SIGNUP_ERROR;
                }
            }
        }
    }


    /**
     * @summary 쿠키에서 토큰을 가져오는 함수.
     * @param cookies
     * @param cookieToFind
     * @throws TOKEN_NOT_FOUND
     * @returns token
     */
    getTokenFromCookie(cookies : string[], cookieToFind: string): string {
        const token = cookies.find(cookie => cookie.includes(cookieToFind));
        if(!token) throw ExceptionList.TOKEN_NOT_FOUND;
        return token.split('=')[1];
    }

    /**
     * @summary jwtToken 생성
     * @param payload extends object
     * @param time 기본값 1 day
     * @returns jwtToken
     */
    generateJwtToken<T extends object>(payload: T, time = 60*60*24): string{
        return this.jwtService.sign(payload, {
            expiresIn: time,
        });
    }

    /**
     * @summary jwtToken의 payload를 가져오는 함수.
     * @param jwtToken
     * @throws INVALID_TOKEN
     */
    getDataFromJwtToken<T>(jwtToken: string) : T & {iat:number,exp: number}{
        try {
            return this.jwtService.decode<T>(jwtToken) as T & {iat:number,exp: number};
        } catch (error){
            throw ExceptionList.INVALID_TOKEN;
        }
    }

    /**
     * @summary userData가 담긴 atk, rtk을 발급
     * @param userData
     * @returns {accessToken, refreshToken}
     */
    getAccessTokens(userData: UserAuthDto) : UserAccessTokensDto {
        const accessToken = this.generateJwtToken(userData,60 * 15);
        const refreshToken = this.generateJwtToken(userData, 60 * 60 * 24 * 7);
        return {accessToken, refreshToken}
    }
}

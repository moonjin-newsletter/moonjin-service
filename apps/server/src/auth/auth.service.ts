import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import * as console from "console";
import {UtilService} from "../util/util.service";
import {
    UserAuthDto,
    LocalLoginDto,
    EnrollWriterDto,
    SocialUserSignupDto,LocalUserSignupDto,LocalWriterSignupDto, SocialWriterSignupDto
} from "./dto";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {ExceptionList} from "../response/error/errorInstances";
import {UserRoleEnum} from "./enum/userRole.enum";
import UserDtoMapper from "../user/userDtoMapper";
import {OauthService} from "./oauth.service";
import {UserDto} from "../user/dto";
import {AuthValidationService} from "./auth.validation.service";
import {WriterDto} from "../writer/dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly oauthService: OauthService,
        private readonly authValidationService: AuthValidationService
    ) {}

    /**
     * @summary 독자의 회원가입을 진행하는 기능
     * @param localSignupData
     * @returns UserAuthDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws NICKNAME_ALREADY_EXIST
     * @throws SIGNUP_ERROR
     * @throws WRITER_SIGNUP_ERROR
     */
    async localUserSignup(localSignupData :LocalUserSignupDto): Promise<UserAuthDto>{
        try {
            let {image, hashedPassword,...signupData} = localSignupData;
            if(!image) image=this.utilService.processImageForProfile(image);

            const createdUser: User = await this.prismaService.user.create({
                data:{
                    ...signupData,
                    password : hashedPassword,
                    role: UserRoleEnum.USER,
                    image,
                    description : "문진 독자입니다.",
                    createdAt : this.utilService.getCurrentDateInKorea()
                }
            })
            return UserDtoMapper.UserToUserAuthDto(createdUser);
        }catch (error){
            this.prismaSignupErrorHandling(error);
            console.error(error)
            throw ExceptionList.SIGNUP_ERROR;
        }
    }

    /**
     * @summary 작가의 회원가입을 진행하는 기능
     * @param localWriterSignupData
     * @returns UserAuthDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws NICKNAME_ALREADY_EXIST
     * @throws SIGNUP_ERROR
     * @throws WRITER_SIGNUP_ERROR
     */
    async localWriterSignup(localWriterSignupData :LocalWriterSignupDto): Promise<UserAuthDto>{
        try {
            let {image, hashedPassword,moonjinId,description,...signupData} = localWriterSignupData;
            if(!description || description.length == 0) description = "문진 작가입니다.";
            if(!image) image = this.utilService.processImageForProfile(image);

            const createdUser= await this.prismaService.user.create({
                data:{
                    ...signupData,
                    password : hashedPassword,
                    role: UserRoleEnum.WRITER,
                    image,
                    description,
                    createdAt : this.utilService.getCurrentDateInKorea(),
                    writerInfo:{
                        create:{
                            moonjinId,
                            createdAt : this.utilService.getCurrentDateInKorea()
                        }
                    }
                }
            })
            return UserDtoMapper.UserToUserAuthDto(createdUser);
        }catch (error){
            this.prismaSignupErrorHandling(error);
            console.error(error)
            throw ExceptionList.WRITER_SIGNUP_ERROR;
        }
    }


    /**
     * @summary 작가 회원가입을 진행하는 함수. 닉네임 변경 Optional
     * @param writerSignupData
     * @param newNickname
     * @returns WriterInfoDto
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     * @throws WRITER_SIGNUP_ERROR
     */
    async enrollWriter(writerSignupData : EnrollWriterDto, newNickname? : string) : Promise<WriterDto>{
        await this.authValidationService.assertUserNotWriter(writerSignupData.userId)
        try {
            const {description, ...writerInfoToEnroll} =writerSignupData;
            const createWriterInfo = this.prismaService.writerInfo.create({
                data:{
                    ...writerInfoToEnroll,
                    createdAt : this.utilService.getCurrentDateInKorea(),
                },
            })
            const changeUserNickname = (newNickname) ? {nickname : newNickname} : {};
            const changeDescription = (description) ? {description} : {
                description: "문진 작가입니다."
            };
            const userUpdate = this.prismaService.user.update({
                where:{
                    id: writerSignupData.userId
                },
                data:{
                    role : UserRoleEnum.WRITER,
                    ...changeUserNickname,
                    ...changeDescription
                }
            })
            const transactionResult = await this.prismaService.$transaction([createWriterInfo, userUpdate]);
            return {
                user : UserDtoMapper.UserToUserDto(transactionResult[1]),
                writerInfo : UserDtoMapper.WriterInfoToWriterInfoDto(transactionResult[0])
            }
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
        await this.oauthService.assertUserNotSocialUser(id);
        try {
            await this.prismaService.user.update({
                where:{
                    id,
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

    /**
     * @summary 유저 정보를 이메일로 가져오는 함수
     * @param email
     * @returns UserAuthDto
     * @throws USER_NOT_FOUND
     */
    async getUserByEmail(email : string): Promise<UserDto> {
        const user = await this.prismaService.user.findUnique({
            where:{
                email,
                deleted : false
            }
        })
        if(!user) throw ExceptionList.USER_NOT_FOUND;
        return UserDtoMapper.UserToUserDto(user);
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
        const user = await this.prismaService.user.findUnique({
            where:{
                email: loginData.email,
            }
        })
        if(!user)
            throw ExceptionList.USER_NOT_FOUND;
        if(!user.password || user.password.length < 2) // 소셜 유저
            throw ExceptionList.SOCIAL_USER_ERROR;
        if (!this.utilService.compareHash(loginData.password, user.password)) // 비밀번호 틀림
            throw ExceptionList.INVALID_PASSWORD;

        return UserDtoMapper.UserToUserAuthDto(user);
    }


    /**
     * @summary 소셜 독자 회원가입을 진행하는 함수
     * @param socialUserSignupData
     * @throws EMAIL_ALREADY_EXIST
     * @throws NICKNAME_ALREADY_EXIST
     * @throws SIGNUP_ERROR
     * @throws SOCIAL_SIGNUP_ERROR
     */
    async socialUserSignup(socialUserSignupData:SocialUserSignupDto) : Promise<UserAuthDto>{
        let {image, oauthId,social,...signupData} = socialUserSignupData;
        if(!image) image = this.utilService.processImageForProfile(image);
        try{
            const createdUser = await this.prismaService.user.create({
                data:{
                    ...signupData,
                    password : "",
                    role : UserRoleEnum.USER,
                    image,
                    description: "문진 독자입니다.",
                    createdAt : this.utilService.getCurrentDateInKorea(),
                    oauth:{
                        create:{
                            oauthId,
                            social
                        }
                    }
                }
            });
            return UserDtoMapper.UserToUserAuthDto(createdUser);
        }catch (error){
            this.prismaSignupErrorHandling(error);
            console.error(error);
            throw ExceptionList.SOCIAL_SIGNUP_ERROR;
        }
    }

    /**
     * @summary 소셜 작가 회원가입을 진행하는 함수
     * @param socialWriterSignupData
     * @throws EMAIL_ALREADY_EXIST
     * @throws NICKNAME_ALREADY_EXIST
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     * @throws SIGNUP_ERROR
     * @throws SOCIAL_SIGNUP_ERROR
     */
    async socialWriterSignup(socialWriterSignupData:SocialWriterSignupDto) : Promise<UserAuthDto>{
        let {image, oauthId,social,description,moonjinId,...signupData} = socialWriterSignupData;
        if(!description || description.length == 0) description = "문진 작가입니다.";
        if(!image) image = this.utilService.processImageForProfile(image);
        try{
            const createdUser = await this.prismaService.user.create({
                data:{
                    ...signupData,
                    password : "",
                    role : UserRoleEnum.WRITER,
                    image,
                    description,
                    createdAt : this.utilService.getCurrentDateInKorea(),
                    oauth:{
                        create:{
                            oauthId,
                            social
                        }
                    },
                    writerInfo:{
                        create:{
                            moonjinId,
                            createdAt : this.utilService.getCurrentDateInKorea()
                        }
                    }
                }
            });
            return UserDtoMapper.UserToUserAuthDto(createdUser);
        }catch (error){
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

}

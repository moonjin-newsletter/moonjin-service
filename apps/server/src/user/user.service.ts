import {Injectable} from '@nestjs/common';
import {ReaderDto} from "./dto/reader.dto";
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import * as console from "console";
import {WriterDto} from "./dto/writer.dto";
import {UtilService} from "../util/util.service";
import {UserDto} from "./dto/user.dto";
import {EmailVerificationPayloadDto} from "./dto/emailVerificationPayload.dto";
import {Exception} from "../response/error";
import { SignupDataDto } from './dto/signupData.dto';
import {UserWithWriterInfo} from "./types/userWithWriterInfo.type";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {ExceptionList} from "../response/error/errorInstances";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService, private readonly utilService: UtilService) {}

    /**
     * @summary 작가 | 독자의 회원가입을 진행하는 기능
     *
     * @param signUpData
     * @throws MAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | SIGNUP_ERROR | WRITER_SIGNUP_ERROR
     */
    async localSignUp(signUpData : SignupDataDto): Promise<ReaderDto | WriterDto> {
        try {
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
                const {writerInfo, ...createdUser} = createdWriter;
                if(writerInfo)
                    return new WriterDto(new ReaderDto(createdUser), writerInfo);
                else
                    throw ExceptionList.WRITER_SIGNUP_ERROR;
            }else{
                const createdUser : User = await this.prismaService.user.create({data});
                return new ReaderDto(createdUser);
            }

        }catch(error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code == "P2002" && error.meta){
                    const errorField = (error.meta.target as string[])[0]
                    switch (errorField){
                        case "email":
                            throw ExceptionList.MAIL_ALREADY_EXIST;
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
     * @summary 이메일 인증이 완료되어, 새로 인증 받은 이메일을 업데이트
     *
     * @param emailPayload
     * @throws MAIL_NOT_EXIST
     */
    async emailVerification(emailPayload: EmailVerificationPayloadDto):Promise<UserDto>{
        try{
            const user:User = await this.prismaService.user.update({
                where:{
                    id:emailPayload.id,
                },
                data:{
                    email : emailPayload.email,
                    role: emailPayload.role
                }
            })
            return new UserDto(user.id, user.email, user.nickname, user.role);
        } catch (error) {
            console.log(error)
            throw ExceptionList.EMAIL_NOT_EXIST
        }

    }

    getAccessTokens(userData: ReaderDto | WriterDto){
        const accessToken = this.utilService.generateJwtToken(userData,60 * 15);
        const refreshToken = this.utilService.generateJwtToken(userData, 60 * 60 * 24 * 7);
        return {accessToken, refreshToken}
    }
}

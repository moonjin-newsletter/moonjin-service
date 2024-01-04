import {Injectable, NotFoundException} from '@nestjs/common';
import { SignupDataDto} from "./dto/signupData.dto";
import {ReaderDto} from "./dto/reader.dto";
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {
    MAIL_ALREADY_EXIST, MOONJIN_EMAIL_ALREADY_EXIST,
    NICKNAME_ALREADY_EXIST,
    SIGNUP_ERROR, WRITER_SIGNUP_ERROR
} from "../response/error/business-error";
import typia from 'typia'
import * as console from "console";
import {WriterDto} from "./dto/writer.dto";
import {UserWithWriterInfo} from "./types/userWithWriterInfo.type";
import {UtilService} from "../util/util.service";
import {UserDto} from "./dto/user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService, private readonly utilService: UtilService) {}

    async localSignUp(signUpData : SignupDataDto): Promise<ReaderDto | WriterDto | MAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | SIGNUP_ERROR | MOONJIN_EMAIL_ALREADY_EXIST | WRITER_SIGNUP_ERROR>{
        try {
            const {moonjinEmail, ...data} = signUpData;
            if(moonjinEmail){ // 작가 회원가입
                const createdWriter:UserWithWriterInfo = await this.prismaService.user.create({
                    data : {
                        ...data,
                        writerInfo: {
                            create: {
                                moonjinEmail
                            }
                        }},
                    include :{
                        writerInfo:true
                }})
                const {writerInfo, ...createdUser} = createdWriter;
                if(writerInfo)
                    return new WriterDto(new ReaderDto(createdUser), writerInfo);
                else
                    return typia.random<WRITER_SIGNUP_ERROR>()
            } else { // 독자 회원가입
                const createdUser : User = await this.prismaService.user.create({data});
                return new ReaderDto(createdUser);
            }
        } catch(error) {
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code == "P2002" && error.meta){
                    const errorField = (error.meta.target as string[])[0]
                    switch (errorField){
                        case "email":
                            return typia.random<MAIL_ALREADY_EXIST>()
                        case "nickname":
                            return typia.random<NICKNAME_ALREADY_EXIST>()
                        case "moonjinEmail":
                            return typia.random<MOONJIN_EMAIL_ALREADY_EXIST>()
                    }
                }
            }
            console.error(error)
            return typia.random<SIGNUP_ERROR>()
        }
    }

    async activateUser(email: string, role : number): Promise<UserDto>{
        try{
            const userResponse : User = await this.prismaService.user.update({
                where : {
                    email
                },
                data : {
                    role
                }
            })
            console.log(userResponse);
            return new UserDto(userResponse.id, userResponse.email,userResponse.nickname, userResponse.role)
        } catch(error){
            console.error(error);
            throw new NotFoundException("해당 메일이 없습니다.");
        }
    }

    getAccessTokens(userData: ReaderDto | WriterDto){
        const accessToken = this.utilService.generateJwtToken(userData,60 * 15);
        const refreshToken = this.utilService.generateJwtToken(userData, 60 * 60 * 24 * 7);
        return {accessToken, refreshToken}
    }
}

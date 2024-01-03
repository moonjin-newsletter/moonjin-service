import {Injectable} from '@nestjs/common';
import {SignupDataDto} from "./dto/signupData.dto";
import {UserDto} from "./dto/user.dto";
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {MAIL_ALREADY_EXIST, NICKNAME_ALREADY_EXIST, SIGNUP_ERROR} from "../response/error/business-error";
import typia from 'typia'

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async localSignUp(signUpData : SignupDataDto): Promise<UserDto | MAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | SIGNUP_ERROR>{
        try {
            const createdUser: User = await this.prismaService.user.create({data: signUpData});
            return new UserDto(createdUser);
        } catch(error) {
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code == "P2002" && error.meta){
                    const errorField = (error.meta.target as string[])[0]
                    switch (errorField){
                        case "email":
                            return typia.random<MAIL_ALREADY_EXIST>()
                        case "nickname":
                            return typia.random<NICKNAME_ALREADY_EXIST>()
                    }
                }
            }
            console.error(error)
            return typia.random<SIGNUP_ERROR>()
        }
    }
}

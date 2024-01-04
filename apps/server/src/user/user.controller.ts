import {Controller } from '@nestjs/common';
import {TypedBody, TypedRoute} from '@nestia/core';
import {ILocalSignUp} from "./api-types/ILocalSignUp";
import {UserService} from "./user.service";
import {createResponseForm} from "../response/response";
import {TryCatch} from "../response/tryCatch";
import {ReaderDto} from "./dto/reader.dto";
import {
  MAIL_ALREADY_EXIST,
  MOONJIN_EMAIL_ALREADY_EXIST,
  NICKNAME_ALREADY_EXIST,
  SIGNUP_ERROR, WRITER_SIGNUP_ERROR
} from "../response/error/business-error";
import {WriterDto} from "./dto/writer.dto";
import {UserDto} from "./dto/user.dto";

@Controller('user')
export class UserController {
  constructor(private readonly userService : UserService) {}

  @TypedRoute.Post()
  async localSignUp(@TypedBody() localSignUpData: ILocalSignUp):Promise<TryCatch<
      ReaderDto | WriterDto,
      MAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | SIGNUP_ERROR | WRITER_SIGNUP_ERROR >> {
    const signUpResponse = await this.userService.localSignUp(localSignUpData);
    return signUpResponse instanceof UserDto ? createResponseForm(signUpResponse) : signUpResponse;
  }
}

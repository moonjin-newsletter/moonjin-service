import {Controller } from '@nestjs/common';
import {TypedBody, TypedRoute} from '@nestia/core';
import {ILocalSignUp} from "./api-types/ILocalSignUp";
import {UserService} from "./user.service";
import {createResponseForm} from "../response/response";
import {TryCatch} from "../response/tryCatch";
import {UserDto} from "./dto/user.dto";
import {MAIL_ALREADY_EXIST, NICKNAME_ALREADY_EXIST, SIGNUP_ERROR} from "../response/error/business-error";

@Controller('user')
export class UserController {
  constructor(private readonly userService : UserService) {}

  @TypedRoute.Post()
  async localSignUp(@TypedBody() signUpData: ILocalSignUp):Promise<TryCatch<UserDto , MAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST |SIGNUP_ERROR >> {
    const response = await this.userService.localSignUp(signUpData);
    return response instanceof UserDto ? createResponseForm(response) : response;
  }
}

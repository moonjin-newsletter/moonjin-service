import {Controller, Req, Res, UnauthorizedException, UseGuards} from '@nestjs/common';
import {TypedBody, TypedRoute} from '@nestia/core';
import {ILocalSignUp} from "./api-types/ILocalSignUp";
import {UserService} from "./user.service";
import {createResponseForm} from "../response/responseForm";
import {UserDto} from "./dto/user.dto";
import {UtilService} from "../util/util.service";
import {Request, Response} from 'express';
import {TryCatch} from "../response/tryCatch";
import {
  MAIL_ALREADY_EXIST,
  MOONJIN_EMAIL_ALREADY_EXIST,
  NICKNAME_ALREADY_EXIST,
  SIGNUP_ERROR, WRITER_SIGNUP_ERROR
} from "../response/error/business-error";
import {AuthGuard} from "@nestjs/passport";
import * as process from "process";
import {EventEmitter2} from "@nestjs/event-emitter";

@Controller('user')
export class UserController {
  constructor(private readonly userService : UserService, private readonly utilSerivce: UtilService,
              private eventEmitter: EventEmitter2) {}

  @TypedRoute.Post()
  async localSignUp(@TypedBody() localSignUpData: ILocalSignUp, @Res() res:Response) : Promise<TryCatch<
      string, MAIL_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | SIGNUP_ERROR | WRITER_SIGNUP_ERROR>> {
    const signUpRole = localSignUpData.role;
    localSignUpData.role = -1; // 계정 비활성화
    const signUpResponse = await this.userService.localSignUp(localSignUpData);
    if (signUpResponse instanceof UserDto){

      const emailVerificationToken = this.utilSerivce.generateJwtToken({email: signUpResponse.email, role: signUpRole}, 60*60*24)
      const accessLink = process.env.SERVER_URL + "/user/email/verification"
      this.eventEmitter.emit('mail-verification', {
        email: signUpResponse.email,
        accessLink,
      });

      res.cookie('email_verification_token', emailVerificationToken);
      res.send(createResponseForm("메일이 전송 되었습니다."));
      return createResponseForm(emailVerificationToken);
    } else{
      res.send(signUpResponse.data);
      return signUpResponse;
    }
  }

  @TypedRoute.Get("email/verification")
  @UseGuards(AuthGuard('jwt-cookie'))
  async emailVerification(@Req() req: Request, @Res() res: Response){
    const emailVerificationCode = req?.cookies?.email_verification_token;
    if(!emailVerificationCode)
      throw new UnauthorizedException("다시 가입해주세요");
    if(req.user.email && req.user.role){
      const user = this.userService.activateUser(req.user.email ,req.user.role);
      res.send(user)
    }
  }

}

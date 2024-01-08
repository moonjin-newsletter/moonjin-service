import {Controller, Res} from '@nestjs/common';
import {TypedBody, TypedQuery, TypedRoute} from '@nestia/core';
import {ILocalSignUp} from "./api-types/ILocalSignUp";
import {UserService} from "./user.service";
import {createResponseForm} from "../response/responseForm";
import {UtilService} from "../util/util.service";
import { Response} from 'express';
import {TryCatch} from "../response/tryCatch";
import {MailService} from "../mail/mail.service";
import {EmailVerificationPayloadDto} from "./dto/emailVerificationPayload.dto";
import {
  EMAIL_ALREADY_EXIST,
  MOONJIN_EMAIL_ALREADY_EXIST,
  NICKNAME_ALREADY_EXIST, WRITER_SIGNUP_ERROR, SIGNUP_ERROR
} from "../response/error/user/signup.error";
import {EMAIL_NOT_EXIST, EMAIL_NOT_VERIFIED} from "../response/error/mail/mail.error";
import {ExceptionList} from "../response/error/errorInstances";
import {ILocalLogin} from "./api-types/ILocalLogin";
import {ICheckEmailExist} from "./api-types/ICheckEmailExist";
import {IEmailVerification} from "./api-types/IEmailVerification";
import {INVALID_PASSWORD, LOGIN_ERROR, USER_NOT_FOUND} from "../response/error/user/login.error";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService : UserService,
              private readonly utilService: UtilService,
              private readonly mailService: MailService) {}

  /**
   * @summary 로걸 회원가입 기능
   * @param localSignUpData 회원가입 정보
   * @param res
   * @returns "메일이 전송되었습니다."
   * @throws EMAIL_ALREADY_EXIST
   * @throws NICKNAME_ALREADY_EXIST
   * @throws MOONJIN_EMAIL_ALREADY_EXIST
   * @throws SIGNUP_ERROR
   * @throws WRITER_SIGNUP_ERROR
   * @throws EMAIL_NOT_EXIST
   */
  @TypedRoute.Post()
  async localSignUp(@TypedBody() localSignUpData: ILocalSignUp, @Res() res:Response) : Promise<TryCatch<string,
      | EMAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | SIGNUP_ERROR | WRITER_SIGNUP_ERROR | EMAIL_NOT_EXIST>> {
    const signUpRole = localSignUpData.role;
    let rollbackFlag = 0;
    try {
      const signUpResponse = await this.userService.localSignUp({...localSignUpData, role:-1});
      rollbackFlag = signUpResponse.id;

      throw ExceptionList.SIGNUP_ERROR;
      const payload: EmailVerificationPayloadDto = {id: signUpResponse.id,email : signUpResponse.email, role: signUpRole};
      const emailVerificationToken = this.utilService.generateJwtToken(payload, 60*60*24);
      await this.mailService.sendVerificationMail(signUpResponse.email, emailVerificationToken);

      res.send(createResponseForm({
        message:"메일이 전송되었습니다."
      }))
      return createResponseForm(emailVerificationToken);
    }catch (error){
      console.log(rollbackFlag)
      if(rollbackFlag > 0)
        await this.userService.deleteUserById(rollbackFlag, signUpRole);
      throw error
    }
  }

  /**
   * @summary 메일 중복 확인
   * @param payload 이메일이 담긴 객체
   * @returns "해당 메일을 사용하실 수 있습니다."
   * @throws EMAIL_ALREADY_EXIST
   */
  @TypedRoute.Post("email/uniqueness")
  async checkEmailExist(@TypedBody() payload:ICheckEmailExist): Promise<TryCatch<{message: string},
      EMAIL_ALREADY_EXIST>> {
    const response = await this.userService.isEmailUnique(payload.email);
    if(response) return createResponseForm({
      message:"해당 메일을 사용하실 수 있습니다."
    })
    else throw ExceptionList.EMAIL_ALREADY_EXIST
  }

  /**
   * @summary 로그인 기능
   * @param localLoginData 로그인 정보
   * @param res
   * @returns "로그인이 완료되었습니다"
   * @throws LOGIN_ERROR
   * @throws INVALID_PASSWORD
   * @throws USER_NOT_FOUND
   * @throws EMAIL_NOT_VERIFIED
   */
  @TypedRoute.Post("auth")
  async localLogin(@TypedBody() localLoginData: ILocalLogin, @Res() res:Response):Promise<TryCatch<
      {message: string }, LOGIN_ERROR | INVALID_PASSWORD | USER_NOT_FOUND | EMAIL_NOT_VERIFIED>>{
    const user = await this.userService.localLogin(localLoginData);
    if(user.role < 0){
      throw ExceptionList.EMAIL_NOT_VERIFIED;
    }
    const jwtTokens = this.userService.getAccessTokens(user);
    res.cookie('accessToken', jwtTokens.accessToken)
    res.cookie('refreshToken', jwtTokens.refreshToken)
    res.send(createResponseForm({
      message: "로그인이 완료되었습니다"
    }))
    return createResponseForm({
      message: "로그인이 완료되었습니다"
    });
  }

  /**
   * @Summary 인증 메일에서 링크를 눌렀을 때 일어나는 인증 과정
   * @param payload 이메일 인증 code가 담긴 객체
   * @param res
   * @returns 메일 인증 결과 페이지로 redirect
   */
  @TypedRoute.Get("email/verification")
  async emailVerification(@TypedQuery() payload: IEmailVerification, @Res() res:Response):Promise<void>
  {
    try {
      if (!payload.code){
        throw ExceptionList.TOKEN_NOT_FOUND;
      }
      const dataFromToken = this.utilService.getDataFromJwtToken<EmailVerificationPayloadDto>(payload.code);
      await this.userService.emailVerification(dataFromToken);
      res.redirect("https://naver.com");
    }catch (e){
      res.redirect("https://google.com");
    }
  }
}

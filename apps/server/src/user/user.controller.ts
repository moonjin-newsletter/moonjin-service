import {Controller, Res} from '@nestjs/common';
import {TypedBody, TypedQuery, TypedRoute} from '@nestia/core';
import {ILocalSignUp} from "./api-types/ILocalSignUp";
import {UserService} from "./user.service";
import {createResponseForm, ResponseMessage} from "../response/responseForm";
import {UtilService} from "../util/util.service";
import { Response} from 'express';
import {TryCatch} from "../response/tryCatch";
import {MailService} from "../mail/mail.service";
import {
  EMAIL_ALREADY_EXIST,
  MOONJIN_EMAIL_ALREADY_EXIST,
  NICKNAME_ALREADY_EXIST
} from "../response/error/user/signup.error";
import {EMAIL_NOT_EXIST, EMAIL_NOT_VERIFIED} from "../response/error/mail/mail.error";
import {ExceptionList} from "../response/error/errorInstances";
import {ILocalLogin} from "./api-types/ILocalLogin";
import {ICheckEmailExist} from "./api-types/ICheckEmailExist";
import {IEmailVerification} from "./api-types/IEmailVerification";
import {ApiTags} from "@nestjs/swagger";
import {ISocialRedirect} from "./api-types/ISocialRedirect";
import {OauthService} from "./oauth.service";
import {ISocialLogin} from "./api-types/ISocialLogin";
import {
  INVALID_PASSWORD,
  LOGIN_ERROR,
  SOCIAL_LOGIN_ERROR,
  SOCIAL_USER_ERROR,
  USER_NOT_FOUND
} from "../response/error/user/login.error";
import {SignupDataDto} from "./dto/signupData.dto";

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService : UserService,
              private readonly utilService: UtilService,
              private readonly mailService: MailService,
              private readonly oauthService: OauthService) {}

  /**
   * @summary 로걸 회원가입 버튼 눌렀을 시
   * @param localSignUpData 회원가입 정보
   * @returns "메일이 전송되었습니다."
   * @throws EMAIL_ALREADY_EXIST
   * @throws NICKNAME_ALREADY_EXIST
   * @throws MOONJIN_EMAIL_ALREADY_EXIST
   * @throws SIGNUP_ERROR
   * @throws WRITER_SIGNUP_ERROR
   * @throws EMAIL_NOT_EXIST
   */
  @TypedRoute.Post()
  async emailSignup(@TypedBody() localSignUpData: ILocalSignUp) : Promise<TryCatch<
      ResponseMessage,
      EMAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | EMAIL_NOT_EXIST>>{
    const {password, role, ...userUniqueData} = localSignUpData;
    await this.userService.assertUserDataUnique(userUniqueData);

    const emailVerificationCode = this.utilService.generateJwtToken(localSignUpData);
    await this.mailService.sendVerificationMail(localSignUpData.email, emailVerificationCode);

    return createResponseForm({message : "메일이 전송되었습니다."})
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
      const dataFromToken = this.utilService.getDataFromJwtToken<SignupDataDto & {iat:number,exp: number}>(payload.code);
      const {iat,exp,...userSignUpData} = dataFromToken;
      const user = await this.userService.localSignUp(userSignUpData);
      const {accessToken, refreshToken} = this.userService.getAccessTokens(user)
      res.cookie('accessToken',accessToken)
      res.cookie('refreshToken', refreshToken)
      res.redirect("http://localhost:8080/user/test");
    }catch (e){
      res.redirect("https://google.com");
    }
  }

  @TypedRoute.Get('test')
  async userTest(){
    return "hi"
  }

  /**
   * @summary 메일 중복 확인
   * @param payload 이메일이 담긴 객체
   * @returns "해당 메일을 사용하실 수 있습니다."
   * @throws EMAIL_ALREADY_EXIST
   */
  @TypedRoute.Post("email/uniqueness")
  async checkEmailExist(@TypedBody() payload:ICheckEmailExist): Promise<TryCatch<
      ResponseMessage,
      EMAIL_ALREADY_EXIST>> {
    await this.userService.assertEmailUnique(payload.email);
    return createResponseForm({
      message:"해당 메일을 사용하실 수 있습니다."
    })
  }

  /**
   * @summary 로그인 기능
   * @param localLoginData 로그인 정보
   * @param res
   * @returns "로그인이 완료되었습니다"
   * @throws LOGIN_ERROR
   * @throws INVALID_PASSWORD
   * @throws USER_NOT_FOUND
   * @throws SOCIAL_USER_ERROR
   * @throws EMAIL_NOT_VERIFIED
   */
  @TypedRoute.Post("auth")
  async localLogin(@TypedBody() localLoginData: ILocalLogin, @Res() res:Response):Promise<TryCatch<
      ResponseMessage,
      LOGIN_ERROR | INVALID_PASSWORD | USER_NOT_FOUND | SOCIAL_USER_ERROR | EMAIL_NOT_VERIFIED>>{
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

  @TypedRoute.Get("oauth/url")
  async redirectToSocialPlatform(@TypedQuery() inputData : ISocialRedirect, @Res() res:Response){
    res.redirect(this.oauthService.getSocialOauthUrl(inputData.social));
  }

  @TypedRoute.Get("oauth")
  async socialLogin(@TypedQuery() socialLoginData : ISocialLogin) : Promise<TryCatch<
      ResponseMessage,
      SOCIAL_LOGIN_ERROR>>{
    const userData = await this.oauthService.socialLogin(socialLoginData);
    console.log(userData);
    return createResponseForm({message:"hihi"})
  }
}

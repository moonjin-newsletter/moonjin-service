import {Controller, Res} from '@nestjs/common';
import {TypedBody, TypedHeaders, TypedQuery, TypedRoute} from '@nestia/core';
import {ILocalSignUp} from "./api-types/ILocalSignUp";
import {AuthService} from "./auth.service";
import {createResponseForm, ResponseMessage} from "../response/responseForm";
import {UtilService} from "../util/util.service";
import { Response} from 'express';
import {TryCatch} from "../response/tryCatch";
import {MailService} from "../mail/mail.service";
import {EMAIL_NOT_EXIST} from "../response/error/mail";
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
  SOCIAL_LOGIN_ERROR, SOCIAL_PROFILE_NOT_FOUND,
  SOCIAL_USER_ERROR,
  USER_NOT_FOUND, USER_NOT_FOUND_IN_SOCIAL,
  INVALID_TOKEN,
  EMAIL_ALREADY_EXIST,
  MOONJIN_EMAIL_ALREADY_EXIST,
  NICKNAME_ALREADY_EXIST, SOCIAL_SIGNUP_ERROR, SOCIAL_SIGNUP_TOKEN_NOT_FOUND
} from "../response/error/auth";
import {SignupDataDto} from "./dto/signupData.dto";
import {ISocialSignup} from "./api-types/ISocialSignup";
import {RequestHeaderDto} from "./dto/requestHeader.dto";
import {UserSocialProfileDto} from "./dto/userSocialProfile.dto";
import * as process from "process";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService : AuthService,
              private readonly utilService: UtilService,
              private readonly mailService: MailService,
              private readonly oauthService: OauthService) {}

  /**
   * @summary 로컬 회원가입 버튼 눌렀을 시
   * @param localSignUpData 회원가입 정보
   * @returns "메일이 전송되었습니다."
   * @throws EMAIL_ALREADY_EXIST
   * @throws NICKNAME_ALREADY_EXIST
   * @throws MOONJIN_EMAIL_ALREADY_EXIST
   * @throws SIGNUP_ERROR
   * @throws WRITER_SIGNUP_ERROR
   * @throws EMAIL_NOT_EXIST
   */
  @TypedRoute.Post('signup')
  async emailSignup(@TypedBody() localSignUpData: ILocalSignUp) : Promise<TryCatch<
      ResponseMessage,
      EMAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | EMAIL_NOT_EXIST>>{
    const {password, role, ...userUniqueData} = localSignUpData;
    await this.authService.assertUserDataUnique(userUniqueData);

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
      const user = await this.authService.localSignUp(userSignUpData);
      const {accessToken, refreshToken} = this.authService.getAccessTokens(user)
      res.cookie('accessToken',accessToken)
      res.cookie('refreshToken', refreshToken)
      res.redirect(process.env.CLIENT_URL + "/");
    }catch (e){
      res.redirect(process.env.CLIENT_URL + "/auth/signup");
    }
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
    await this.authService.assertEmailUnique(payload.email);
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
  @TypedRoute.Post("login")
  async localLogin(@TypedBody() localLoginData: ILocalLogin, @Res() res:Response):Promise<
      void |
      LOGIN_ERROR | INVALID_PASSWORD | USER_NOT_FOUND | SOCIAL_USER_ERROR>{
    const user = await this.authService.localLogin(localLoginData);
    const jwtTokens = this.authService.getAccessTokens(user);
    res.cookie('accessToken', jwtTokens.accessToken)
    res.cookie('refreshToken', jwtTokens.refreshToken)
    res.send(createResponseForm({
      message: "로그인이 완료되었습니다"
    }))
  }

  /**
   * @summary 소셜 로그인 페이지로 이동
   * @param inputData
   * @param res
   */
  @TypedRoute.Get("oauth")
  async redirectToSocialPlatform(@TypedQuery() inputData : ISocialRedirect, @Res() res:Response) : Promise<void>{
    res.redirect(this.oauthService.getSocialOauthUrl(inputData.social));
  }

  /**
   * @summary 소셜 로그인 후 redirectUrl에서 진행하는 본 서비스 로그인처리
   * @param socialLoginData
   * @param res
   * @returns redirect 메시지
   */
  @TypedRoute.Get("oauth/login")
  async socialLogin(@TypedQuery() socialLoginData : ISocialLogin, @Res() res:Response) : Promise<
      void | SOCIAL_LOGIN_ERROR | USER_NOT_FOUND_IN_SOCIAL | SOCIAL_PROFILE_NOT_FOUND>
  {
    console.log(socialLoginData);
    const userData = await this.oauthService.socialLogin(socialLoginData);
    console.log(userData)
    if(userData.result){ // login 처리
      const jwtTokens = this.authService.getAccessTokens(userData.data);
      res.cookie('accessToken', jwtTokens.accessToken)
      res.cookie('refreshToken', jwtTokens.refreshToken)
      res.redirect(process.env.CLIENT_URL + ""); // TODO : redirect to success page
    } else { // 추가 정보 입력 페이지로 이동
      console.log(process.env.SERVER_URL + "/auth/social?email=" + userData.data.email)
      res.cookie('socialSignupToken', this.utilService.generateJwtToken(userData.data));
      res.redirect(process.env.CLIENT_URL + "/auth/social?email=" + userData.data.email) // TODO : redirect to success page
    }
  }

  @TypedRoute.Post('oauth/signup')
  async socialSignup(@TypedBody() socialSignupData : ISocialSignup, @TypedHeaders() header:RequestHeaderDto, @Res() res:Response):
      Promise<void |
      SOCIAL_SIGNUP_TOKEN_NOT_FOUND | INVALID_TOKEN | EMAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | SOCIAL_SIGNUP_ERROR>
    {
      console.log(socialSignupData)
      console.log(header);
    const cookie = header.cookie.find(cookie => cookie.includes("socialSignupToken"));
    if(!cookie) throw ExceptionList.SOCIAL_SIGNUP_TOKEN_NOT_FOUND;

    const socialSignupToken = cookie.split("=")[1];
    const {iat,exp,...userSocialData} = this.utilService.getDataFromJwtToken<UserSocialProfileDto & {iat:number,exp: number}>(socialSignupToken);
    const user = await this.authService.socialSignup({...userSocialData, ...socialSignupData});
    const {accessToken, refreshToken} = this.authService.getAccessTokens(user)
    res.cookie('accessToken', accessToken)
    res.cookie('refreshToken', refreshToken)
    res.send(createResponseForm({
      message: "회원가입이 완료되었습니다."
    }));
  }
}

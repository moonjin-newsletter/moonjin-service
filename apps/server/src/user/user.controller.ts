import {Controller, Res} from '@nestjs/common';
import {TypedBody, TypedHeaders, TypedQuery, TypedRoute} from '@nestia/core';
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
  NICKNAME_ALREADY_EXIST, SOCIAL_SIGNUP_ERROR, SOCIAL_SIGNUP_TOKEN_NOT_FOUND
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
  SOCIAL_LOGIN_ERROR, SOCIAL_PROFILE_NOT_FOUND,
  SOCIAL_USER_ERROR,
  USER_NOT_FOUND, USER_NOT_FOUND_IN_SOCIAL
} from "../response/error/user/login.error";
import {SignupDataDto} from "./dto/signupData.dto";
import {ISocialSignup} from "./api-types/ISocialSignup";
import {RequestHeaderDto} from "./dto/requestHeader.dto";
import {UserSocialProfileDto} from "./dto/userSocialProfile.dto";
import {INVALID_TOKEN} from "../response/error/auth/jwtToken.error";
import * as process from "process";

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
      res.redirect(process.env.CLIENT_URL + "");
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

  /**
   * @summary 소셜 로그인 페이지로 이동
   * @param inputData
   * @param res
   */
  @TypedRoute.Get("oauth/url")
  async redirectToSocialPlatform(@TypedQuery() inputData : ISocialRedirect, @Res() res:Response){
    res.redirect(this.oauthService.getSocialOauthUrl(inputData.social));
  }

  /**
   * @summary 소셜 로그인 후 redirectUrl에서 진행하는 본 서비스 로그인처리
   * @param socialLoginData
   * @param res
   * @returns redirect 메시지
   */
  @TypedRoute.Get("oauth")
  async socialLogin(@TypedQuery() socialLoginData : ISocialLogin, @Res() res:Response) : Promise<
      void | SOCIAL_LOGIN_ERROR | USER_NOT_FOUND_IN_SOCIAL | SOCIAL_PROFILE_NOT_FOUND>{
    console.log(socialLoginData);
    const userData = await this.oauthService.socialLogin(socialLoginData);
    console.log(userData)
    if(userData.result){ // login 처리
      const jwtTokens = this.userService.getAccessTokens(userData.data);
      res.cookie('accessToken', jwtTokens.accessToken)
      res.cookie('refreshToken', jwtTokens.refreshToken)
      res.redirect("https://naver.com")
    } else { // 추가 정보 입력 페이지로 이동
      console.log(process.env.SERVER_URL + "/auth/social?email=" + userData.data.email)
      res.cookie('socialSignupToken', this.utilService.generateJwtToken(userData.data));
      res.redirect(process.env.SERVER_URL + "/auth/social?email=" + userData.data.email)
    }
  }

  @TypedRoute.Post('oauth')
  async socialSignup(@TypedBody() socialSignupData : ISocialSignup, @TypedHeaders() header:RequestHeaderDto, @Res() res:Response):
      Promise<TryCatch<ResponseMessage,
      SOCIAL_SIGNUP_TOKEN_NOT_FOUND | INVALID_TOKEN | EMAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | SOCIAL_SIGNUP_ERROR>>
    {
      console.log(socialSignupData)
      console.log(header);
    const cookie = header.cookie.find(cookie => cookie.includes("socialSignupToken"));
    if(!cookie) throw ExceptionList.SOCIAL_SIGNUP_TOKEN_NOT_FOUND;

    const socialSignupToken = cookie.split("=")[1];
    const dataFromToken = this.utilService.getDataFromJwtToken<UserSocialProfileDto & {iat:number,exp: number}>(socialSignupToken);
    const {iat,exp,...userSocialData} = dataFromToken;
    const user = await this.userService.socialSignup({...userSocialData, ...socialSignupData});
    const {accessToken, refreshToken} = this.userService.getAccessTokens(user)
    res.cookie('accessToken', accessToken)
    res.cookie('refreshToken', refreshToken)
    res.send(createResponseForm({
      message: "회원가입이 완료되었습니다."
    }));
    return createResponseForm({
      message: "회원가입이 완료되었습니다."
    })
  }
}

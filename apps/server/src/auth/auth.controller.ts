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
  NICKNAME_ALREADY_EXIST, SOCIAL_SIGNUP_ERROR, TOKEN_NOT_FOUND, PASSWORD_CHANGE_ERROR, SIGNUP_ROLE_ERROR
} from "../response/error/auth";
import {ISocialSignup} from "./api-types/ISocialSignup";
import {RequestHeaderDto, UserSocialProfileDto, UserAuthDto, SignupEmailCodePayloadDto} from "./dto";
import * as process from "process";
import {AuthValidationService} from "./auth.validation.service";
import {UserRoleEnum} from "./enum/userRole.enum";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService : AuthService,
              private readonly authValidationService: AuthValidationService,
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
   * @throws SIGNUP_ROLE_ERROR
   */
  @TypedRoute.Post('signup')
  async emailSignup(@TypedBody() localSignUpData: ILocalSignUp) : Promise<TryCatch<
      ResponseMessage,
      SIGNUP_ROLE_ERROR | EMAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | EMAIL_NOT_EXIST>>
  {
    const {password, role, ...userUniqueData} = localSignUpData;
    if((role === UserRoleEnum.WRITER && !userUniqueData.moonjinId) || (role === UserRoleEnum.USER && userUniqueData.moonjinId)) throw ExceptionList.SIGNUP_ROLE_ERROR;
    await this.authValidationService.assertSignupDataUnique(userUniqueData);
    const hashedPassword = this.utilService.getHashCode(localSignUpData.password);
    const emailVerificationCode = this.authService.generateJwtToken<SignupEmailCodePayloadDto>({...userUniqueData, role, hashedPassword});
    await this.mailService.sendVerificationMail(localSignUpData.email, emailVerificationCode);
    return createResponseForm({message : "메일이 전송되었습니다."})
  }

  /**
   * @Summary 인증 메일에서 링크를 눌렀을 때 일어나는 인증 과정
   * @param payload 이메일 인증 code가 담긴 객체
   * @param res
   * @returns 메일 인증 결과 페이지로 redirect
   * @throws INVALID_TOKEN
   * @throws EMAIL_ALREADY_EXIST
   * @throws NICKNAME_ALREADY_EXIST
   * @throws MOONJIN_EMAIL_ALREADY_EXIST
   * @throws SIGNUP_ERROR
   * @throws WRITER_SIGNUP_ERROR
   */
  @TypedRoute.Get("signup/email/verification")
  async emailVerification(@TypedQuery() payload: IEmailVerification, @Res() res:Response):Promise<void>
  {
    try {
      const {iat,exp,...userSignUpData} =  this.authService.getDataFromJwtToken<SignupEmailCodePayloadDto>(payload.code);
      const userData = await this.authService.localSignUp(userSignUpData);
      const {accessToken, refreshToken} = this.authService.getAccessTokens(userData)
      res.cookie('accessToken',accessToken, {
        secure: process.env.VERSION === 'prod',
        sameSite: process.env.VERSION === 'prod' ? 'none' : false
      })
      res.cookie('refreshToken', refreshToken, {
        secure: process.env.VERSION === 'prod',
        sameSite: process.env.VERSION === 'prod' ? 'none' : false
      })
      res.redirect(process.env.CLIENT_URL + "/");
    }catch (e){
      res.redirect(process.env.CLIENT_URL + "/auth/signup");
    }
  }

  /**
   * @summary 비밀번호 변경 메일 전송
   * @param payload
   * @returns "비밀번호 변경 메일이 전송되었습니다."
   * @throws USER_NOT_FOUND
   * @throws EMAIL_NOT_EXIST
   */
  @TypedRoute.Post("/password/change")
  async sendPasswordChangeMail(@TypedBody() payload: ICheckEmailExist):Promise<TryCatch<
      ResponseMessage,
      USER_NOT_FOUND | EMAIL_NOT_EXIST>>{
    const user = await this.authService.getUserByEmail(payload.email)
    if(!user) throw ExceptionList.USER_NOT_FOUND;

    const passwordChangeToken = this.authService.generateJwtToken(user);
    await this.mailService.sendMailForPasswordChangePage(payload.email, passwordChangeToken);
    return createResponseForm({message : "비밀번호 변경 메일이 전송되었습니다."})
  }

  /**
   * @Summary 인증 메일에서 링크를 눌렀을 때 일어나는 인증 과정
   * @param payload 이메일 인증 code가 담긴 객체
   * @param res
   * @returns 메일 인증 결과 페이지로 redirect
   * @throws INVALID_TOKEN
   */
  @TypedRoute.Get("password/email/verification")
  async emailVerificationForPasswordChange(@TypedQuery() payload: IEmailVerification, @Res() res:Response):Promise<void> {
    try {
      const {iat,exp,...userData} = this.authService.getDataFromJwtToken<UserAuthDto>(payload.code);
      const passwordChangeToken = this.authService.generateJwtToken(userData);
      res.cookie('passwordChangeToken', passwordChangeToken, {
        secure: process.env.VERSION === 'prod',
        sameSite: process.env.VERSION === 'prod' ? 'none' : false
      })
      res.redirect(process.env.CLIENT_URL + "/auth/password/new");
    }catch (error){
      console.log(error);
      res.redirect(process.env.CLIENT_URL + "/auth/password/failed"); // TODO : redirect Page 변경 필요
    }
  }

  /**
   * @summary 비밀번호 변경
   * @param payload {password}
   * @param header
   * @param res
   * @returns "비밀번호가 변경되었습니다."
   * @throws TOKEN_NOT_FOUND
   * @throws INVALID_TOKEN
   * @throws PASSWORD_CHANGE_ERROR
   */
  @TypedRoute.Patch("password")
  async passwordChange(@TypedBody() payload: ILocalLogin, @TypedHeaders() header:RequestHeaderDto, @Res() res:Response):Promise<
      void | TOKEN_NOT_FOUND | INVALID_TOKEN | PASSWORD_CHANGE_ERROR>{
    const token = this.authService.getTokenFromCookie(header.cookie, "passwordChangeToken");
    const {iat,exp,...dataFromToken} = this.authService.getDataFromJwtToken<UserAuthDto>(token);
    await this.authService.passwordChange(dataFromToken.id, payload.password);
    res.cookie("passwordChangeToken", "", {
      secure: process.env.VERSION === 'prod',
      sameSite: process.env.VERSION === 'prod' ? 'none' : false,
      maxAge: 0
    }) // 쿠키 삭제
    res.send(createResponseForm({message : "비밀번호가 변경되었습니다."}))
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
    await this.authValidationService.assertEmailUnique(payload.email);
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
    const {accessToken, refreshToken }= this.authService.getAccessTokens(user);
    console.log(process.env.VERSION === 'prod');
    res.cookie('accessToken', accessToken, {
      secure: process.env.VERSION === 'prod',
      sameSite: process.env.VERSION === 'prod' ? 'none' : false
    })
    res.cookie('refreshToken', refreshToken, {
      secure: process.env.VERSION === 'prod',
      sameSite: process.env.VERSION === 'prod' ? 'none' : false
    })
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
      void | SOCIAL_LOGIN_ERROR | USER_NOT_FOUND_IN_SOCIAL | SOCIAL_PROFILE_NOT_FOUND> {
    try {
      const userData = await this.oauthService.socialLogin(socialLoginData);
      if(userData.result) { // login 처리
        const jwtTokens = this.authService.getAccessTokens(userData.data);
        res.cookie('accessToken', jwtTokens.accessToken, {
          secure: process.env.VERSION === 'prod',
          sameSite: process.env.VERSION === 'prod' ? 'none' : false
        })
        res.cookie('refreshToken', jwtTokens.refreshToken, {
          secure: process.env.VERSION === 'prod',
          sameSite: process.env.VERSION === 'prod' ? 'none' : false
        })
        res.redirect(process.env.CLIENT_URL + ""); // TODO : redirect to success page
      }else { // 추가 정보 입력 페이지로 이동
        res.cookie('socialSignupToken', this.authService.generateJwtToken(userData.data), {
          secure: process.env.VERSION === 'prod',
          sameSite: process.env.VERSION === 'prod' ? 'none' : false
        });
        res.redirect(process.env.CLIENT_URL + "/auth/social?email=" + userData.data.email) // TODO : redirect to success page
      }
    }catch (error){ // 아예 인증이 안 됨
      console.log(error)
      res.redirect(process.env.CLIENT_URL + "/auth/failed?code=" + error.code) // TODO : redirect to failed page
    }
  }

  /**
   * @summary 소셜 회원가입
   * @param socialSignupData
   * @param header
   * @param res
   * @returns 회원가입 완료 메시지
   * @throws SIGNUP_ROLE_ERROR
   * @throws TOKEN_NOT_FOUND
   * @throws INVALID_TOKEN
   * @throws EMAIL_ALREADY_EXIST
   * @throws NICKNAME_ALREADY_EXIST
   * @throws MOONJIN_EMAIL_ALREADY_EXIST
   * @throws SOCIAL_SIGNUP_ERROR
   */
  @TypedRoute.Post('oauth/signup')
  async socialSignup(@TypedBody() socialSignupData : ISocialSignup, @TypedHeaders() header:RequestHeaderDto, @Res() res:Response):
      Promise<void |
      TOKEN_NOT_FOUND | INVALID_TOKEN | EMAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | SOCIAL_SIGNUP_ERROR>
  {
    if((socialSignupData.role === UserRoleEnum.WRITER && !socialSignupData.moonjinId) || (socialSignupData.role === UserRoleEnum.USER && socialSignupData.moonjinId)) throw ExceptionList.SIGNUP_ROLE_ERROR;
    const socialSignupToken = this.authService.getTokenFromCookie(header.cookie, "socialSignupToken");
    const {iat,exp,...userSocialData} = this.authService.getDataFromJwtToken<UserSocialProfileDto>(socialSignupToken);
    const user = await this.authService.socialSignup({...userSocialData, ...socialSignupData});
    const {accessToken, refreshToken} = this.authService.getAccessTokens(user)
    res.cookie('accessToken', accessToken, {
      secure: process.env.VERSION === 'prod',
      sameSite: process.env.VERSION === 'prod' ? 'none' : false
    })
    res.cookie('refreshToken', refreshToken, {
      secure: process.env.VERSION === 'prod',
      sameSite: process.env.VERSION === 'prod' ? 'none' : false
    })
    res.cookie('socialSignupToken', "",  {
      secure: process.env.VERSION === 'prod',
      sameSite: process.env.VERSION === 'prod' ? 'none' : false,
      maxAge: 0
    })
    res.send(createResponseForm({
      message: "회원가입이 완료되었습니다."
    }));
  }

  @TypedRoute.Post('logout')
  async logout(@Res() res: Response):Promise<void>{
    res.cookie('accessToken', "", {
      secure: process.env.VERSION === 'prod',
      sameSite: process.env.VERSION === 'prod' ? 'none' : false,
      maxAge: 0
    })
    res.cookie('refreshToken', "", {
      secure: process.env.VERSION === 'prod',
      sameSite: process.env.VERSION === 'prod' ? 'none' : false,
      maxAge: 0
    })
    res.send(createResponseForm({
      message: "로그아웃이 완료되었습니다."
    }))
  }
}

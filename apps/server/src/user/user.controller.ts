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
import {EMAIL_NOT_EXIST} from "../response/error/mail/mail.error";
import {ExceptionList} from "../response/error/errorInstances";
import {ILocalLogin} from "./api-types/ILocalLogin";
import {ICheckEmailExist} from "./api-types/ICheckEmailExist";
import {IEmailVerification} from "./api-types/IEmailVerification";

@Controller('user')
export class UserController {
  constructor(private readonly userService : UserService,
              private readonly utilService: UtilService,
              private readonly mailService: MailService) {}

  /**
   * @summary 로걸 회원가입 기능
   * 회원 가입에 필요한 정보를 입력 받아, 유효성 및 중복 검사 확인 후, 유저를 저장한다.
   * 회원은 작가일 수도, 독자일 수도 있다. (role = 0 독자 / role = 1 작가)
   * 성공 시, 회원 가입 메일을 전송한다.
   *
   * @param localSignUpData
   * @param res
   * @return 200 : 메일이 전송되었다는 메시지 or Error
   */
  @TypedRoute.Post()
  async localSignUp(@TypedBody() localSignUpData: ILocalSignUp, @Res() res:Response) : Promise<TryCatch<
      string, EMAIL_ALREADY_EXIST | NICKNAME_ALREADY_EXIST | MOONJIN_EMAIL_ALREADY_EXIST | SIGNUP_ERROR | WRITER_SIGNUP_ERROR | EMAIL_NOT_EXIST>> {

    const signUpRole = localSignUpData.role;
    const signUpResponse = await this.userService.localSignUp({...localSignUpData, role:-1});

    const payload: EmailVerificationPayloadDto = {id: signUpResponse.id,email : signUpResponse.email, role: signUpRole};
    const emailVerificationToken = this.utilService.generateJwtToken(payload, 60*60*24);
    await this.mailService.sendVerificationMail(signUpResponse.email, emailVerificationToken);

    res.send(createResponseForm({
      message:"메일이 전송되었습니다."
    }))
    return createResponseForm(emailVerificationToken);

  }

  @TypedRoute.Post("email/uniqueness")
  async checkEmailExist(@TypedBody() payload:ICheckEmailExist){
    const response = await this.userService.isEmailUnique(payload.email);
    if(response) return createResponseForm({
      message:"해당 메일을 사용하실 수 있습니다."
    })
    else throw ExceptionList.EMAIL_ALREADY_EXIST
  }

  @TypedRoute.Post("auth")
  async localLogin(@TypedBody() localLoginData: ILocalLogin, @Res() res:Response){
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
  }

  /**
   * @Summary 인증 메일에서 링크를 눌렀을 때 일어나는 인증 과정
   * 메일에서 링크 클릭 시, 해당 링크에 있는 code를 jwt 로 열어 데이터 확인 후 인증
   * 인증이 완료되면 메일 인증 완료 페이지로 이동
   *
   * @query code
   */
  @TypedRoute.Get("email/verification")
  async emailVerification(@TypedQuery() payload: IEmailVerification, @Res() res:Response)
  {
    try {
      if (!payload.code){
        throw ExceptionList.TOKEN_NOT_FOUND;
      }
      const dataFromToken = this.utilService.getDataFromJwtToken<EmailVerificationPayloadDto>(payload.code);
      console.log(dataFromToken)
      await this.userService.emailVerification(dataFromToken);
      res.redirect("https://naver.com");
    }catch (e){
      res.redirect("https://google.com");
    }
  }
}

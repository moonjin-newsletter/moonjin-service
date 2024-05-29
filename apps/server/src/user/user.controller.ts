import {TypedBody, TypedQuery, TypedRoute} from '@nestia/core';
import {Controller, Res, UseGuards} from '@nestjs/common';
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {UserService} from "./user.service";
import {createResponseForm, ResponseMessage} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {
    MOONJIN_EMAIL_ALREADY_EXIST,
    NICKNAME_ALREADY_EXIST, SOCIAL_USER_ERROR,
    USER_NOT_FOUND,
    USER_NOT_WRITER,
    WRITER_SIGNUP_ERROR
} from "../response/error/auth";
import {
    UserDto,
    UserWithPasswordDto, UserOrWriterDto
} from "./dto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {OauthService} from "../auth/oauth.service";
import {IChangeUserProfile} from "./api-types/IChangeUserProfile";
import {AuthService} from "../auth/auth.service";
import {Response} from "express";
import UserDtoMapper from "./userDtoMapper";
import {IChangePassword} from "./api-types/IChangePassword";
import {MailService} from "../mail/mail.service";
import {EMAIL_NOT_EXIST} from "../response/error/mail";
import {IEmailVerification} from "../auth/api-types/IEmailVerification";
import * as process from "process";
import {ErrorCodeEnum} from "../response/error/enum/errorCode.enum";
import {IChangeWriterProfile} from "../writer/api-types/IChangeWriterProfile";
import {PROFILE_CHANGE_ERROR} from "../response/error/user";
import {ICreateWriterInfo} from "../writer/api-types/ICreateWriterInfo";
import {UserRoleEnum} from "../auth/enum/userRole.enum";
import {JwtUtilService} from "../auth/jwtUtil.service";
import httpsCookieOption from "../auth/httpsCookieOption";

@Controller('user')
export class UserController {
    cookieOptions = httpsCookieOption;

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly oauthService: OauthService,
        private readonly mailService: MailService,
        private readonly jwtUtilService : JwtUtilService
    ) {}

    /**
     * @summary 내 정보 가져오기
     * @param user
     * @returns {user:UserDto, subscribe?: WriterInfoDto}
     * @throws USER_NOT_FOUND
     * @throws USER_NOT_WRITER
     */
    @TypedRoute.Get()
    @UseGuards(UserAuthGuard)
    async getUser(@User() user : UserAuthDto): Promise<TryCatch<UserOrWriterDto,USER_NOT_FOUND | USER_NOT_WRITER>>
    {
        const userData = await this.userService.getUserData(user.id, user.role);
        return createResponseForm(userData);
    }

    /**
     * @summary 유저의 oauth Provider 정보 가져오기
     * @param user
     * @returns {social:string}
     */
    @TypedRoute.Get('oauth')
    @UseGuards(UserAuthGuard)
    async getUserOauthProvider(@User() user : UserAuthDto): Promise<Try<{social : string}>> {
        try{
            const userOauth = await this.oauthService.getUserOauthByUserId(user.id);
            return createResponseForm({ social : userOauth.social });
        } catch (error){
            return createResponseForm({ social : "moonjin" });
        }
    }

    /**
     * @summary 유저 프로필 변경 API
     * @param user
     * @param res
     * @param newProfile
     * @returns
     * @throws PROFILE_CHANGE_ERROR
     * @throws NICKNAME_ALREADY_EXIST
     * @throws USER_NOT_FOUND
     */
    @TypedRoute.Patch('profile')
    @UseGuards(UserAuthGuard)
    async changeUserProfile(@User() user:UserAuthDto, @Res() res: Response, @TypedBody() newProfile : IChangeUserProfile): Promise<TryCatch<UserDto,
        PROFILE_CHANGE_ERROR | NICKNAME_ALREADY_EXIST | USER_NOT_FOUND>> {
        const newUser = await this.userService.changeUserProfile(user.id, newProfile);
        const {accessToken, refreshToken }= this.jwtUtilService.getAccessTokens(UserDtoMapper.UserDtoToUserAuthDto(newUser));
        res.cookie('accessToken', accessToken, this.cookieOptions)
        res.cookie('refreshToken', refreshToken, this.cookieOptions)
        res.send(createResponseForm(newUser));
        return createResponseForm(newUser);
    }

    /**
     * @summary 작가 프로필 변경 API
     * @param user
     * @param res
     * @param newProfile
     * @returns
     * @throws PROFILE_CHANGE_ERROR
     * @throws NICKNAME_ALREADY_EXIST
     * @throws USER_NOT_WRITER
     * @throws USER_NOT_FOUND
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     */
    @TypedRoute.Patch('writer/profile')
    @UseGuards(WriterAuthGuard)
    async changeWriterProfile(@User() user:UserAuthDto, @Res() res: Response, @TypedBody() newProfile : IChangeWriterProfile): Promise<TryCatch<UserDto,
        PROFILE_CHANGE_ERROR | NICKNAME_ALREADY_EXIST | USER_NOT_WRITER | USER_NOT_FOUND | MOONJIN_EMAIL_ALREADY_EXIST>> {
        const newUser = await this.userService.changeWriterProfile(user.id, newProfile);
        const {accessToken, refreshToken }= this.jwtUtilService.getAccessTokens(UserDtoMapper.UserDtoToUserAuthDto(newUser));
        res.cookie('accessToken', accessToken,this.cookieOptions)
        res.cookie('refreshToken', refreshToken,this.cookieOptions)
        res.send(createResponseForm(newUser));
        return createResponseForm(newUser);
    }

    /**
     * @summary 비밀번호 변경 요청 API (메일 전송, 쿠키 설정)
     * @param user
     * @param res
     * @param body
     * @returns
     * @throws EMAIL_NOT_EXIST
     * @throws SOCIAL_USER_ERROR
     */
    @TypedRoute.Patch('password')
    @UseGuards(UserAuthGuard)
    async changeUserPassword(@User() user:UserAuthDto, @Res() res: Response, @TypedBody() body : IChangePassword): Promise<TryCatch<ResponseMessage,
        SOCIAL_USER_ERROR | EMAIL_NOT_EXIST>> {
        await this.oauthService.assertUserNotSocialUser(user.id);
        const passwordChangeCode = this.jwtUtilService.generateJwtToken<UserWithPasswordDto>({userId: user.id, password: body.newPassword});
        await this.mailService.sendMailForPasswordChange(user.email,passwordChangeCode);
        res.cookie('passwordChangeCode', passwordChangeCode, this.cookieOptions);
        res.send(createResponseForm({message: "비밀번호 변경을 위한 이메일을 발송했습니다."}));
        return createResponseForm({message: "비밀번호 변경을 위한 이메일을 발송했습니다."});
    }

    /**
     * @summary 비밀번호 변경 메일 링크 클릭
     * @param payload
     * @param res
     * @returns
     */
    @TypedRoute.Get('password/change')
    async callBackForChangeUserPassword(@TypedQuery() payload: IEmailVerification, @Res() res:Response): Promise<void>{
        try{
            const jwtData = this.jwtUtilService.getDataFromJwtToken<UserWithPasswordDto>(payload.code);
            await this.authService.passwordChange(jwtData.userId, jwtData.password);
            res.cookie('passwordChangeCode', '', {
                ...this.cookieOptions,
                maxAge: 0
            });
            res.redirect(process.env.CLIENT_URL + "/password/change/success");
        }catch (error){
            if(error.code == ErrorCodeEnum.INVALID_TOKEN)
                res.redirect(process.env.CLIENT_URL + "/password/change/fail?error=invalidToken");
            else if(error.code == ErrorCodeEnum.PASSWORD_CHANGE_ERROR)
                res.redirect(process.env.CLIENT_URL + "/password/change/fail?error=passwordChangeError");
            else
                res.redirect(process.env.CLIENT_URL + "/password/change/fail?error=socialUserError");
        }
    }

    /**
     * @summary 작가 시작하기 API
     * @param user
     * @param writerData
     * @param res
     * @returns
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     * @throws WRITER_SIGNUP_ERROR
     * @throws NICKNAME_ALREADY_EXIST
     */
    @TypedRoute.Post("writer")
    @UseGuards(UserAuthGuard)
    async becomeWriter(@User() user:UserAuthDto, @TypedBody() writerData : ICreateWriterInfo, @Res() res:Response): Promise<TryCatch<ResponseMessage,
        MOONJIN_EMAIL_ALREADY_EXIST | WRITER_SIGNUP_ERROR | NICKNAME_ALREADY_EXIST>> {
        const newWriter = await this.authService.enrollWriter({moonjinId:writerData.moonjinId,description:writerData.description, userId:user.id}, writerData.nickname);
        const {accessToken, refreshToken} = this.jwtUtilService.getAccessTokens({...user,nickname:newWriter.user.nickname,role:UserRoleEnum.WRITER});
        res.cookie('accessToken',accessToken, this.cookieOptions)
        res.cookie('refreshToken', refreshToken,this.cookieOptions)
        res.send(createResponseForm({
            message: "작가로 등록되었습니다."
        }));
        return createResponseForm({
            message: "작가로 등록되었습니다."
        })
    }
}

import {TypedBody, TypedParam, TypedQuery, TypedRoute} from '@nestia/core';
import {Controller, Res, UseGuards} from '@nestjs/common';
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {UserService} from "./user.service";
import {createResponseForm, ResponseForm, ResponseMessage} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {
    EMAIL_ALREADY_EXIST,
    MOONJIN_EMAIL_ALREADY_EXIST,
    NICKNAME_ALREADY_EXIST,
    USER_NOT_FOUND,
    USER_NOT_WRITER,
    WRITER_SIGNUP_ERROR
} from "../response/error/auth";
import {
    AllFollowerDto,
    ExternalFollowerDto,
    FollowingWriterProfileDto,
    UserDto,
    UserWithPasswordDto,
    WriterDto
} from "./dto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {FOLLOWER_ALREADY_EXIST, FOLLOWER_NOT_FOUND} from "../response/error/user";
import {ICreateExternalFollower} from "./api-types/ICreateExternalFollower";
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
import {IChangeWriterProfile} from "./api-types/IChangeWriterProfile";
import {PROFILE_CHANGE_ERROR} from "../response/error/user/user.error";
import {ICreateWriterInfo} from "./api-types/ICreateWriterInfo";
import {ExceptionList} from "../response/error/errorInstances";
import {UserRoleEnum} from "../auth/enum/userRole.enum";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly oauthService: OauthService,
        private readonly mailService: MailService
    ) {}

    /**
     * @summary 팔로우 기능
     * @param writerId
     * @param user
     * @returns
     * @throws USER_NOT_WRITER
     * @throws FOLLOW_MYSELF_ERROR
     * @throws FOLLOW_ALREADY_ERROR
     */
    @TypedRoute.Post(":id/Follow")
    @UseGuards(UserAuthGuard)
    async follow(@TypedParam("id") writerId : number, @User() user : UserAuthDto) {
        await this.userService.followWriter(user.id, writerId);
        await this.userService.synchronizeFollower(writerId, true);
        return createResponseForm({
            message: "팔로우 성공"
        })
    }

    /**
     * @summary 팔로우 취소 기능
     * @param writerId
     * @param user
     * @returns
     * @throws USER_NOT_WRITER
     * @throws FOLLOW_MYSELF_ERROR
     */
    @TypedRoute.Delete(":id/Follow")
    @UseGuards(UserAuthGuard)
    async unfollow(@TypedParam("id") writerId : number, @User() user : UserAuthDto) {
        await this.userService.unfollowWriter(user.id, writerId);
        await this.userService.synchronizeFollower(writerId, false);
        return createResponseForm({
            message: "팔로우 취소 성공"
        })
    }

    /**
     * @summary 유저의 팔로잉 작가 목록 가져오기
     * @param user
     * @returns FollowingWriterProfileDto[]
     */
    @TypedRoute.Get("Following")
    @UseGuards(UserAuthGuard)
    async getFollowingUserList(@User() user : UserAuthDto) : Promise<ResponseForm<FollowingWriterProfileDto[]>> {
        const followingWriterList = await this.userService.getFollowingWriterListByFollowerId(user.id);
        return createResponseForm(followingWriterList.filter(writer => writer.user.id != user.id));
    }

    /**
     * @summary 내 정보 가져오기
     * @param user
     * @returns {user:UserDto, writer?: WriterInfoDto}
     * @throws USER_NOT_FOUND
     * @throws USER_NOT_WRITER
     */
    @TypedRoute.Get()
    @UseGuards(UserAuthGuard)
    async getUser(@User() user : UserAuthDto): Promise<TryCatch<{user:UserDto} | WriterDto,
    USER_NOT_FOUND | USER_NOT_WRITER>>
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
     * @summary 작가의 팔로워 목록 보기
     * @param user
     * @returns AllFollowerDto
     */
    @TypedRoute.Get("follower")
    @UseGuards(WriterAuthGuard)
    async getFollowerList(@User() user : UserAuthDto) : Promise<Try<AllFollowerDto>> {
        const followerList = await this.userService.getAllInternalFollowerByWriterId(user.id)
        const externalFollowerList = await this.userService.getExternalFollowerListByWriterId(user.id);
        return createResponseForm({
            followerList : followerList.filter(follower => follower.user.id != user.id)
            ,externalFollowerList
        });
    }

    /**
     * @summary 외부 구독자 추가 API
     * @param user
     * @param followerData
     * @returns ResponseMessage & ExternalFollowerDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws FOLLOWER_ALREADY_EXIST
     */
    @TypedRoute.Post('follower/external')
    @UseGuards(WriterAuthGuard)
    async addExternalFollower(@User() user:UserAuthDto,@TypedBody() followerData : ICreateExternalFollower)
    :Promise<TryCatch<ResponseMessage & ExternalFollowerDto, EMAIL_ALREADY_EXIST | FOLLOWER_ALREADY_EXIST>>{
        const externalFollower = await this.userService.addExternalFollowerByEmail(user.id,followerData.followerEmail);
        await this.userService.synchronizeFollower(user.id, true);
        return createResponseForm({
            message: "구독자 추가에 성공했습니다.",
            ...externalFollower,
        })
    }

    /**
     * @summary 외부 구독자 제거 API
     * @param user
     * @param followerData
     * @returns ResponseMessage & ExternalFollowerDto
     * @throws FOLLOWER_NOT_FOUND
     */
    @TypedRoute.Delete('follower/external')
    @UseGuards(WriterAuthGuard)
    async deleteExternalFollower(@User() user:UserAuthDto, @TypedBody() followerData : ICreateExternalFollower)
        :Promise<TryCatch<ResponseMessage & ExternalFollowerDto, FOLLOWER_NOT_FOUND>>{
        const externalFollower = await this.userService.deleteExternalFollowerByEmail(user.id,followerData.followerEmail);
        await this.userService.synchronizeFollower(user.id, false);
        return createResponseForm({
            message: "구독자 삭제에 성공했습니다.",
            ...externalFollower,
        })
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
        const {accessToken, refreshToken }= this.authService.getAccessTokens(UserDtoMapper.UserDtoToUserAuthDto(newUser));
        res.cookie('accessToken', accessToken)
        res.cookie('refreshToken', refreshToken)
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
        const {accessToken, refreshToken }= this.authService.getAccessTokens(UserDtoMapper.UserDtoToUserAuthDto(newUser));
        res.cookie('accessToken', accessToken)
        res.cookie('refreshToken', refreshToken)
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
     */
    @TypedRoute.Patch('password')
    @UseGuards(UserAuthGuard)
    async changeUserPassword(@User() user:UserAuthDto, @Res() res: Response, @TypedBody() body : IChangePassword): Promise<TryCatch<ResponseMessage,
        EMAIL_NOT_EXIST>> {
        const passwordChangeCode = this.authService.generateJwtToken<UserWithPasswordDto>({userId: user.id, password: body.newPassword});
        await this.mailService.sendMailForPasswordChange(user.email,passwordChangeCode);
        res.cookie('passwordChangeCode', passwordChangeCode);
        res.send(createResponseForm({message: "비밀번호 변경을 위한 이메일을 발송했습니다."}));
        return createResponseForm({message: "비밀번호 변경을 위한 이메일을 발송했습니다."});
    }

    /**
     * @summary 비밀번호 변경 메일 링크 클릭
     * @param payload
     * @returns
     */
    @TypedRoute.Get('password/change')
    async callBackForChangeUserPassword(@TypedQuery() payload: IEmailVerification, @Res() res:Response): Promise<void>{
        try{
            const jwtData = this.authService.getDataFromJwtToken<UserWithPasswordDto>(payload.code);
            await this.authService.passwordChange(jwtData.userId, jwtData.password);
            res.cookie('passwordChangeCode', '', {maxAge: 0});
            res.redirect(process.env.CLIENT_URL ?? "http://localhost:3000" + "/password/change/success");
        }catch (error){
            if(error.code == ErrorCodeEnum.INVALID_TOKEN)
                res.redirect(process.env.CLIENT_URL ?? "http://localhost:3000" + "/password/change/fail?error=invalidToken");
            else if(error.code == ErrorCodeEnum.PASSWORD_CHANGE_ERROR)
                res.redirect(process.env.CLIENT_URL ?? "http://localhost:3000" + "/password/change/fail?error=passwordChangeError");
            else
                res.redirect(process.env.CLIENT_URL ?? "http://localhost:3000" + "/password/change/fail?error=socialUserError");
        }
    }

    /**
     * @summary 팔로워 삭제 API
     * @param followerId
     * @param writer
     * @returns
     * @throws USER_NOT_FOUND
     * @throws FOLLOWER_NOT_FOUND
     */
    @TypedRoute.Delete('follower/:id')
    @UseGuards(WriterAuthGuard)
    async deleteFollower(@TypedParam("id") followerId : number, @User() writer : UserAuthDto): Promise<TryCatch<{message:string},
        USER_NOT_FOUND | FOLLOWER_NOT_FOUND>> {
        await this.userService.deleteFollower(followerId, writer.id);
        return createResponseForm({
            message: "팔로워 삭제에 성공했습니다."
        })
    }

    /**
     * @summary 회원, 작가로 등록 API
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
        const writerInfo = await this.authService.writerSignup({moonjinId:writerData.moonjinId,description:writerData.description, userId:user.id});
        try{
            if(writerData.nickname != user.nickname)
                await this.userService.changeUserProfile(user.id, {nickname: writerData.nickname});
            await this.userService.updateUserRole(user.id, UserRoleEnum.WRITER);
        }catch (error){
            await this.userService.deleteWriterById(writerInfo.userId);
            throw ExceptionList.NICKNAME_ALREADY_EXIST;
        }
        const {accessToken, refreshToken} = this.authService.getAccessTokens({...user,nickname:writerData.nickname?? user.nickname,role:UserRoleEnum.WRITER});
        res.cookie('accessToken',accessToken)
        res.cookie('refreshToken', refreshToken)
        res.send(createResponseForm({
            message: "작가로 등록되었습니다."
        }));
        return createResponseForm({
            message: "작가로 등록되었습니다."
        })
    }
}

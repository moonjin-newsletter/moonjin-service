import { Controller, Res, UseGuards } from '@nestjs/common';
import {TypedBody, TypedParam, TypedRoute} from "@nestia/core";
import {Try, TryCatch} from "../response/tryCatch";
import {USER_NOT_WRITER} from "@moonjin/api-types";
import {WriterInfoService} from "./writerInfo.service";
import {createResponseForm, ResponseMessage} from "../response/responseForm";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {IChangeWriterProfile} from "./api-types/IChangeWriterProfile";
import {UserDto} from "../user/dto";
import {PROFILE_CHANGE_ERROR} from "../response/error/user";
import {
    MOONJIN_EMAIL_ALREADY_EXIST,
    NICKNAME_ALREADY_EXIST,
    USER_NOT_FOUND,
    WRITER_SIGNUP_ERROR
} from "../response/error/auth";
import UserDtoMapper from "../user/userDtoMapper";
import {Response} from "express";
import {JwtUtilService} from "../auth/jwtUtil.service";
import httpsCookieOption from "../auth/httpsCookieOption";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {ICreateWriterInfo} from "./api-types/ICreateWriterInfo";
import {UserRoleEnum} from "../auth/enum/userRole.enum";
import {AuthService} from "../auth/auth.service";
import {MailService} from "../mail/mail.service";
import {SitemapResponseDto} from "../common";

@Controller('writer')
export class WriterInfoController {
    cookieOptions = httpsCookieOption;

    constructor(
        private readonly writerInfoService: WriterInfoService,
        private readonly jwtUtilService:JwtUtilService,
        private readonly authService:AuthService,
        private readonly mailService:MailService
    ) {}

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
    @TypedRoute.Post()
    @UseGuards(UserAuthGuard)
    async becomeWriter(@User() user:UserAuthDto, @TypedBody() writerData : ICreateWriterInfo, @Res() res:Response): Promise<TryCatch<ResponseMessage,
        MOONJIN_EMAIL_ALREADY_EXIST | WRITER_SIGNUP_ERROR | NICKNAME_ALREADY_EXIST>> {
        const newWriter = await this.authService.enrollWriter({moonjinId:writerData.moonjinId,description:writerData.description, userId:user.id}, writerData.nickname);
        await this.mailService.createEmailRouteByMoonjinId(newWriter.writerInfo.moonjinId, newWriter.user.email);
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
    @TypedRoute.Patch('profile')
    @UseGuards(WriterAuthGuard)
    async changeWriterProfile(@User() user:UserAuthDto, @Res() res:Response, @TypedBody() newProfile : IChangeWriterProfile): Promise<TryCatch<UserDto,
        PROFILE_CHANGE_ERROR | NICKNAME_ALREADY_EXIST | USER_NOT_WRITER | USER_NOT_FOUND | MOONJIN_EMAIL_ALREADY_EXIST>> {
        const newUser = await this.writerInfoService.changeWriterProfile(user.id, newProfile);
        const {accessToken, refreshToken }= this.jwtUtilService.getAccessTokens(UserDtoMapper.UserDtoToUserAuthDto(newUser));
        res.cookie('accessToken', accessToken,this.cookieOptions)
        res.cookie('refreshToken', refreshToken,this.cookieOptions)
        res.send(createResponseForm(newUser));
        return createResponseForm(newUser);
    }

    @TypedRoute.Get(":writerId/synch/profile")
    async synchWriterInfo(@TypedParam("writerId") writerId:number){
        await this.writerInfoService.synchronizeNewsLetter(writerId);
        await this.writerInfoService.synchronizeSeries(writerId);
        return createResponseForm("동기화 완료");
    }

    /**
     * @summary sitemap용 작가 전체정보 가져오기
     */
    @TypedRoute.Get("sitemap")
    async getWriterSitemap():Promise<Try<SitemapResponseDto[]>>{
        const sitemap = await this.writerInfoService.getAllWriterListForSitemap();
        return createResponseForm(sitemap.map(writer => {
            return {
                id: writer.user.id,
                moonjinId: writer.moonjinId,
            }
        }));
    }
}

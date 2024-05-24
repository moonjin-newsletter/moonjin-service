import {Controller, UseGuards} from '@nestjs/common';
import {SubscribeService} from "./subscribe.service";
import {TypedBody, TypedParam, TypedRoute} from "@nestia/core";
import {createResponseForm, ResponseMessage} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {EMAIL_ALREADY_EXIST, USER_NOT_WRITER} from "../response/error/auth";
import {IAddExternalUserFromForm} from "./api-types/IAddExternalUserFromForm";
import {SUBSCRIBER_ALREADY_EXIST, SUBSCRIBER_NOT_FOUND} from "../response/error/subscribe";
import {WriterService} from "../writer/writer.service";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {SubscribingWriterProfileDto, AllSubscriberDto, ExternalSubscriberDto} from "./dto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {ICreateExternalSubscriber} from "./api-types/ICreateExternalSubscriber";

@Controller('subscribe')
export class SubscribeController {
    constructor(
        private readonly writerService:WriterService,
        private readonly subscribeService:SubscribeService
    ) {}

    /**
     * 구독폼에서 작가 구독 신청하기 API
     * @param body
     * @throws USER_NOT_WRITER
     * @throws EMAIL_ALREADY_EXIST
     * @throws SUBSCRIBER_ALREADY_EXIST
     */
    @TypedRoute.Post('form')
    async addSubscribeFromForm(@TypedBody() body : IAddExternalUserFromForm):Promise<TryCatch<ResponseMessage,
        USER_NOT_WRITER | EMAIL_ALREADY_EXIST | SUBSCRIBER_ALREADY_EXIST>>{
        const writerPublicCard = await this.writerService.getWriterPublicCardByMoonjinId(body.writerMoonjinId);
        await this.subscribeService.addExternalSubscriberByEmail(writerPublicCard.user.id, body.email);
        return createResponseForm({message: "구독 신청되었습니다."})
    }

    /**
     * @summary 유저의 팔로잉 작가 목록 가져오기
     * @param user
     * @returns SubscribingWriterProfileDto[]
     */
    @TypedRoute.Get("writer/all")
    @UseGuards(UserAuthGuard)
    async getFollowingUserList(@User() user : UserAuthDto) : Promise<Try<SubscribingWriterProfileDto[]>> {
        const followingWriterList = await this.subscribeService.getSubscribingWriterListBySubscriberId(user.id);
        return createResponseForm(followingWriterList);
    }

    /**
     * @summary 팔로우 기능
     * @param writerId
     * @param user
     * @returns
     * @throws USER_NOT_WRITER
     * @throws FOLLOW_MYSELF_ERROR
     * @throws FOLLOW_ALREADY_ERROR
     */
    @TypedRoute.Post(":writerId")
    @UseGuards(UserAuthGuard)
    async follow(@TypedParam("writerId") writerId : number, @User() user : UserAuthDto) {
        await this.subscribeService.subscribeWriter(user.id, writerId);
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
    @TypedRoute.Delete(":writerId")
    @UseGuards(UserAuthGuard)
    async unfollow(@TypedParam("id") writerId : number, @User() user : UserAuthDto) {
        await this.subscribeService.unsubscribeWriter(user.id, writerId);
        return createResponseForm({
            message: "팔로우 취소 성공"
        })
    }


    /**
     * @summary 작가의 구독자 목록 보기
     * @param user
     * @returns AllSubscriberDto
     */
    @TypedRoute.Get("subscriber/all")
    @UseGuards(WriterAuthGuard)
    async getFollowerList(@User() user : UserAuthDto) : Promise<Try<AllSubscriberDto>> {
        const allFollowerList = await this.subscribeService.getAllSubscriberByWriterId(user.id);
        return createResponseForm(allFollowerList);
    }

    /**
     * @summary 외부 구독자 추가 API
     * @param user
     * @param followerData
     * @returns ResponseMessage & ExternalFollowerDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws SUBSCRIBER_ALREADY_EXIST
     */
    @TypedRoute.Post('subscriber/external')
    @UseGuards(WriterAuthGuard)
    async addExternalFollower(@User() user:UserAuthDto, @TypedBody() followerData : ICreateExternalSubscriber)
        :Promise<TryCatch<ResponseMessage & ExternalSubscriberDto, EMAIL_ALREADY_EXIST | SUBSCRIBER_ALREADY_EXIST>>{
        const externalFollower = await this.subscribeService.addExternalSubscriberByEmail(user.id,followerData.followerEmail);
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
     * @throws SUBSCRIBER_NOT_FOUND
     */
    @TypedRoute.Delete('subscriber/external')
    @UseGuards(WriterAuthGuard)
    async deleteExternalFollower(@User() user:UserAuthDto, @TypedBody() followerData : ICreateExternalSubscriber)
        :Promise<TryCatch<ResponseMessage & ExternalSubscriberDto, SUBSCRIBER_NOT_FOUND>>{
        const externalFollower = await this.subscribeService.deleteExternalSubscriberByEmail(user.id,followerData.followerEmail);
        return createResponseForm({
            message: "구독자 삭제에 성공했습니다.",
            ...externalFollower,
        })
    }


    /**
     * @summary 구독자 숨기기 API
     * @param followerId
     * @param writer
     * @returns
     * @throws USER_NOT_WRITER
     * @throws SUBSCRIBER_NOT_FOUND
     */
    @TypedRoute.Patch(':id/hide')
    @UseGuards(WriterAuthGuard)
    async deleteFollower(@TypedParam("id") followerId : number, @User() writer : UserAuthDto): Promise<TryCatch<{message:string},
        USER_NOT_WRITER | SUBSCRIBER_NOT_FOUND>> {
        await this.subscribeService.hideSubscriber(followerId, writer.id);
        return createResponseForm({
            message: "팔로워 삭제에 성공했습니다."
        })
    }
}

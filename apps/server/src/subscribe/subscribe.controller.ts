import {Controller, UseGuards} from '@nestjs/common';
import {SubscribeService} from "./subscribe.service";
import {TypedBody, TypedParam, TypedRoute} from "@nestia/core";
import {createResponseForm, ResponseMessage} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {EMAIL_ALREADY_EXIST, USER_NOT_WRITER} from "../response/error/auth";
import {IAddExternalUserFromForm} from "./api-types/IAddExternalUserFromForm";
import { SUBSCRIBER_ALREADY_EXIST, SUBSCRIBER_NOT_FOUND} from "../response/error/subscribe";
import {WriterInfoService} from "../writerInfo/writerInfo.service";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {
    SubscribingWriterProfileDto,
    AllSubscriberDto,
    ExternalSubscriberDto,
    AddExternalSubscriberResultDto, SubscribingResponseDto,
} from "./dto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {ICreateExternalSubscriber} from "./api-types/ICreateExternalSubscriber";
import {UtilService} from "../util/util.service";
import {IDeleteExternalSubscriber} from "./api-types/IDeleteExternalSubscriber";
import {ICreateExternalSubscriberList} from "./api-types/ICreateExternalSubscriberList";
import SubscribeDtoMapper from "./SubscribeDtoMapper";
import {ErrorCodeEnum} from "../response/error/enum/errorCode.enum";

@Controller('subscribe')
export class SubscribeController {
    constructor(
        private readonly writerInfoService:WriterInfoService,
        private readonly subscribeService:SubscribeService,
        private readonly utilService: UtilService
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
        const { writerMoonjinId, ...externalSubscriber } = body;
        const writerPublicCard = await this.writerInfoService.getWriterPublicCardByMoonjinId(writerMoonjinId);
        await this.subscribeService.addExternalSubscriberByWriterId(writerPublicCard.user.id, externalSubscriber );
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
        return createResponseForm(followingWriterList.map(writer => SubscribeDtoMapper.SubscribingWriterInfoWithUserToSubscribingWriterDto(writer)));
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
     * @summary 팔로우 기능
     * @param writerId
     * @param user
     * @returns
     * @throws USER_NOT_WRITER
     * @throws FOLLOW_MYSELF_ERROR
     * @throws FOLLOW_ALREADY_ERROR
     */
    @TypedRoute.Post("writer/:writerId")
    @UseGuards(UserAuthGuard)
    async followWriterById(@TypedParam("writerId") writerId : number, @User() user : UserAuthDto) {
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
    @TypedRoute.Delete("writer/:writerId")
    @UseGuards(UserAuthGuard)
    async unfollowWriterById(@TypedParam("id") writerId : number, @User() user : UserAuthDto) {
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
     * @param body
     * @returns ResponseMessage & ExternalFollowerDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws SUBSCRIBER_ALREADY_EXIST
     */
    @TypedRoute.Post('subscriber/external')
    @UseGuards(WriterAuthGuard)
    async addExternalFollower(@User() user:UserAuthDto, @TypedBody() body : ICreateExternalSubscriber)
        :Promise<TryCatch<ResponseMessage & ExternalSubscriberDto, EMAIL_ALREADY_EXIST | SUBSCRIBER_ALREADY_EXIST>>{
        const externalFollower = await this.subscribeService.addExternalSubscriberByWriterId(user.id, body);
        return createResponseForm({
            message: "구독자 추가에 성공했습니다.",
            ...externalFollower,
        })
    }

    /**
     * @summary 외부 구독자 목록 추가 API
     * @param user
     * @param body
     */
    @TypedRoute.Post('subscriber/external/list')
    @UseGuards(WriterAuthGuard)
    async addExternalFollowerList(@User() user:UserAuthDto, @TypedBody() body : ICreateExternalSubscriberList)
        :Promise<TryCatch<AddExternalSubscriberResultDto, EMAIL_ALREADY_EXIST | SUBSCRIBER_ALREADY_EXIST>>{
        const validFollowerEmailList = body.subscriberList.slice(0, 100);
        const createdSubscriberList = await this.subscribeService.addExternalSubscriberListByEmail(user.id, body.subscriberList);
        const success = createdSubscriberList.map(createdSubscriber => ({
            subscriberEmail: createdSubscriber.subscriberEmail,
            subscriberName: createdSubscriber.subscriberName,
        }));
        const successEmailList = success.map(subscriber => subscriber.subscriberEmail);
        const fail = validFollowerEmailList
            .filter(subscriber => !successEmailList.includes(subscriber.subscriberEmail))
            .map(subscriber => ({
                subscriberEmail: subscriber.subscriberEmail,
                subscriberName: subscriber.subscriberName,
        }));

        return createResponseForm({
            success,
            fail,
            message: success.length +" 명의 구독자 추가에 성공했습니다.",
            createdAt : this.utilService.getCurrentDateInKorea()
        });
    }

    /**
     * @summary 외부 구독자 제거 API
     * @param user
     * @param body
     * @returns ResponseMessage & ExternalFollowerDto
     * @throws SUBSCRIBER_NOT_FOUND
     */
    @TypedRoute.Delete('subscriber/external')
    @UseGuards(WriterAuthGuard)
    async deleteExternalFollower(@User() user:UserAuthDto, @TypedBody() body : IDeleteExternalSubscriber)
        :Promise<TryCatch<ResponseMessage & ExternalSubscriberDto, SUBSCRIBER_NOT_FOUND>>{
        const result = await this.subscribeService.deleteExternalSubscriberByEmail(user.id,body.subscriberEmail);
        const response = SubscribeDtoMapper.SubscriberExternalToExternalSubscriberDto(result);
        return createResponseForm({
            message: "구독자 삭제에 성공했습니다.",
            ...response,
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

    /**
     * @summary 작가 구독 정보 가져오기 API
     * @param user
     * @param moonjinId
     * @returns SubscribingResponseDto
     */
    @TypedRoute.Get('moonjinId/:moonjinId')
    @UseGuards(UserAuthGuard)
    async getSubscribeOrNotByMoonjinId(@User() user:UserAuthDto, @TypedParam("moonjinId") moonjinId : string):
        Promise<Try<SubscribingResponseDto>>{
        try{
            const writerCard = await this.writerInfoService.getWriterPublicCardByMoonjinId(moonjinId);
            const subscribe = await this.subscribeService.isSubscribingAWriter(user.id, writerCard.user.id);
            return createResponseForm({isSubscribing : true, createdAt: subscribe.subscribe.createdAt})
        }catch (error){
            if(error.response.code === ErrorCodeEnum.SUBSCRIBE_MYSELF_ERROR) return createResponseForm({isSubscribing : false,isMe: true})
            return createResponseForm({isSubscribing : false,isMe: false})
        }
    }
}

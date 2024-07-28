import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {
    ExternalSubscriberDto,
    AllSubscriberDto,
    SubscriberDto, ExternalSubscriberInfoDto,
} from "./dto";
import {AuthValidationService} from "../auth/auth.validation.service";
import {UtilService} from "../util/util.service";
import {ExceptionList} from "../response/error/errorInstances";
import {SubscribingWriterInfoWithUser} from "./prisma/subscribingWriterInfoWithUser.prisma.type";
import SubscribeDtoMapper from "./SubscribeDtoMapper";
import {Subscribe, SubscribeExternal} from "@prisma/client";
import {WriterInfoService} from "../writerInfo/writerInfo.service";

@Injectable()
export class SubscribeService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authValidationService: AuthValidationService,
        private readonly utilService: UtilService,
        private readonly writerInfoService: WriterInfoService
    ) {}

    /**
     * @summary 외부 구독자 추가하기
     * @param writerId
     * @param externalSubscriber
     * @returns ExternalSubscriberDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws SUBSCRIBE_ALREADY_ERROR
     */
    async addExternalSubscriberByWriterId(writerId: number, externalSubscriber : ExternalSubscriberInfoDto): Promise<ExternalSubscriberDto> {
        await this.authValidationService.assertEmailUnique(externalSubscriber.subscriberEmail);
        try{
            const externalFollow = await this.prismaService.subscribeExternal.create({
                data: {
                    writerId,
                    ...externalSubscriber,
                    createdAt: this.utilService.getCurrentDateInKorea()
                }
            })
            return SubscribeDtoMapper.SubscriberExternalToExternalSubscriberDto(externalFollow)
        }catch (error){
            console.log(error);
            throw ExceptionList.SUBSCRIBE_ALREADY_ERROR;
        }
    }

    /**
     * @summary 외부 구독자 추가하기
     * @param moonjinId
     * @param externalSubscriber
     * @returns ExternalSubscriberDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws SUBSCRIBE_ALREADY_ERROR
     */
    async addExternalSubscriberByMoonjinId(moonjinId: string, externalSubscriber : ExternalSubscriberInfoDto): Promise<ExternalSubscriberDto> {
        const writerCard = await this.writerInfoService.getWriterPublicCardByMoonjinId(moonjinId);
        return this.addExternalSubscriberByWriterId(writerCard.user.id, externalSubscriber);
    }

    /**
     * @summary 외부 구독자 bulk 추가하기
     * @param writerId
     * @param externalSubscriberList
     * @returns ExternalSubscriberDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws SUBSCRIBE_ALREADY_ERROR
     */
    async addExternalSubscriberListByEmail(writerId: number,  externalSubscriberList : ExternalSubscriberInfoDto[]): Promise<SubscribeExternal[]> {
        if(externalSubscriberList.length === 0) return [];
        const createdAt = this.utilService.getCurrentDateInKorea();
        const result = await this.prismaService.subscribeExternal.createManyAndReturn({
            data : externalSubscriberList.map(externalSubscriber => {
                return {
                    writerId,
                    ...externalSubscriber,
                    createdAt,
                }
            }),
            skipDuplicates: true
        })
        await this.synchronizeSubscriber(writerId);
        return result;
    }

    /**
     * @summary 작가를 팔로우
     * @param followerId
     * @param writerId
     * @returns void
     * @throws USER_NOT_WRITER
     * @throws SUBSCRIBE_MYSELF_ERROR
     * @throws SUBSCRIBE_ALREADY_ERROR
     */
    async subscribeWriter(followerId : number, writerId : number): Promise<void> {
        if(followerId === writerId) throw ExceptionList.SUBSCRIBE_MYSELF_ERROR;
        await this.authValidationService.assertWriter(writerId);
        try {
            await this.prismaService.subscribe.create({
                data: {
                    followerId,
                    writerId,
                    createdAt : this.utilService.getCurrentDateInKorea()
                }
            });
            await this.synchronizeSubscriber(writerId);
        }catch (error) {
            throw ExceptionList.SUBSCRIBE_ALREADY_ERROR;
        }
    }

    /**
     * @summary 작가를 언팔로우
     * @param followerId
     * @param writerId
     * @returns void
     * @throws SUBSCRIBE_MYSELF_ERROR
     * @throws SUBSCRIBE_ALREADY_ERROR
     * @throws USER_NOT_WRITER
     */
    async unsubscribeWriter(followerId : number, writerId : number): Promise<void> {
        if(followerId === writerId) throw ExceptionList.SUBSCRIBE_MYSELF_ERROR;
        await this.authValidationService.assertWriter(writerId);
        try {
            await this.prismaService.subscribe.delete({
                where: {
                    followerId_writerId: {
                        writerId,
                        followerId
                    }
                }
            });
            await this.synchronizeSubscriber(writerId);
        }catch (error) {
            throw ExceptionList.SUBSCRIBE_ALREADY_ERROR;
        }
    }

    /**
     * @summary 해당 유저의 팔로잉 목록을 가져오기
     * @param followerId
     * @returns FollowingWriterProfileDto[]
     */
    async getSubscribingWriterListBySubscriberId(followerId : number): Promise<SubscribingWriterInfoWithUser[]> {
        return this.prismaService.subscribe.findMany({
            where: {
                followerId,
                writerInfo: {
                    deleted: false
                }
            },
            include: {
                writerInfo: {
                    include : {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    /**
     * @summary 해당 작가의 모든 팔로워 목록을 가져오기
     * @param writerId
     * @returns AllSubscriberDto
     */
    async getAllSubscriberByWriterId(writerId : number): Promise<AllSubscriberDto> {
        return {
            subscriberList: await this.getAllInternalSubscriberByWriterId(writerId),
            externalSubscriberList: await this.getAllExternalSubscriberByWriterId(writerId)
        }
    }

    /**
     * @summary 해당 작가의 모든 팔로워 이메일 목록 가져오기
     * @param writerId
     */
    async getAllSubscriberEmailsByWriterId(writerId: number): Promise<string[]> {
        const internalSubscriberList = await this.getAllInternalSubscriberByWriterId(writerId);
        const externalSubscriberList = await this.getAllExternalSubscriberByWriterId(writerId);
        return internalSubscriberList.map(subscriber => subscriber.user.email).concat(externalSubscriberList.map(subscriber => subscriber.subscriberEmail));
    }

    /**
     * @summary 해당 작가의 팔로워 목록 가져오기
     * @param writerId
     * @returns UserProfileDto[]
     */
    async getAllInternalSubscriberByWriterId(writerId: number): Promise<SubscriberDto[]> {
        const followerList = await this.prismaService.subscribe.findMany({
            where :{
                writerId,
                user :{
                    deleted : false
                }
            },
            include : {
                user : true
            },
            relationLoadStrategy: 'join'
        })
        if(followerList.length == 0) return [];
        return followerList.map(follower => {
            return SubscribeDtoMapper.UserToSubscriberDto(follower.user, follower.createdAt);
        })
    }

    /**
     * @summary 외부 팔로워 목록 가져오기
     * @param writerId
     * @returns ExternalSubscriberDto[]
     */
    async getAllExternalSubscriberByWriterId(writerId: number): Promise<ExternalSubscriberDto[]> {
        const externalFollowerList = await this.prismaService.subscribeExternal.findMany({
            where: {
                writerId
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return externalFollowerList.map(externalFollower => SubscribeDtoMapper.SubscriberExternalToExternalSubscriberDto(externalFollower));
    }

    /**
     * @summary 작가 시리즈 수 증가
     * @param userId
     * @returns void
     * @throws USER_NOT_WRITER
     */
    async synchronizeSubscriber(userId :number) {
        const followerList = await this.getAllSubscriberByWriterId(userId);
        try{
            await this.prismaService.writerInfo.update({
                where: {
                    userId
                },
                data : {
                    followerCount : followerList.subscriberList.length + followerList.externalSubscriberList.length
                },
            })
        }catch (error){
            throw ExceptionList.USER_NOT_WRITER
        }
    }

    /**
     * @summary 팔로워 숨기기
     * @param followerId
     * @param writerId
     * @returns void
     * @throws USER_NOT_WRITER
     * @throws SUBSCRIBER_NOT_FOUND
     */
    async hideSubscriber(followerId: number, writerId: number): Promise<void> {
        await this.authValidationService.assertWriter(followerId);
        try {
            await this.prismaService.subscribe.update({
                where: {
                    followerId_writerId: {
                        writerId,
                        followerId
                    }
                },
                data: {
                    hide: true
                }
            }) // update는 updateMany와 달리, 찾으려는 column이 없을 경우 에러를 발생시킵니다.
            await this.synchronizeSubscriber(writerId);
        }catch (error){
            console.log(error);
            throw ExceptionList.SUBSCRIBER_NOT_FOUND;
        }
    }


    /**
     * @summary 외부 팔로워 삭제하기
     * @param writerId
     * @param subscriberEmail
     * @returns ExternalSubscriberDto
     * @throws SUBSCRIBER_NOT_FOUND
     */
    async deleteExternalSubscriberByEmail(writerId: number, subscriberEmail: string): Promise<SubscribeExternal> {
        try{
            return await this.prismaService.subscribeExternal.delete({
                where: {
                    subscriberEmail_writerId: {
                        writerId,
                        subscriberEmail
                    }
                }
            })
        }catch (error){
            throw ExceptionList.SUBSCRIBER_NOT_FOUND;
        }
    }

    /**
     * @summary 해당 유저가 작가를 팔로잉 중인지 확인
     * @param followerId
     * @param writerId
     * @returns Subscribe
     */
    async assertUserIsSubscribingTheWriter(followerId: number, writerId: number): Promise<Subscribe> {
        const subscribe = await this.prismaService.subscribe.findUnique({
            where: {
                followerId_writerId: {
                    writerId,
                    followerId
                }
            }
        })
        if(!subscribe) throw ExceptionList.SUBSCRIBER_NOT_FOUND;
        return subscribe;
    }

    /**
     * @summary 해당 유저가 작가를 구독중인지 체크, 구독하면 Subscribe 반환
     * @param followerId
     * @param writerId
     * @returns Subscribe
     * @throws SUBSCRIBER_NOT_FOUND
     * @throws SUBSCRIBE_MYSELF_ERROR
     */
    async isSubscribingAWriter(followerId: number, writerId: number): Promise<SubscriberDto> {
        if(followerId === writerId) throw ExceptionList.SUBSCRIBE_MYSELF_ERROR;
        try{
            const subscriber = await this.prismaService.subscribe.findUniqueOrThrow({
                where: {
                    followerId_writerId: {
                        writerId,
                        followerId
                    }
                },
                include: {
                    user: true
                }
            })
            return SubscribeDtoMapper.UserToSubscriberDto(subscriber.user, subscriber.createdAt);
        }catch (error){
            throw ExceptionList.SUBSCRIBER_NOT_FOUND
        }
    }

}

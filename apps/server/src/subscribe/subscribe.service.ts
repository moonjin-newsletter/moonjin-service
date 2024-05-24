import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ExternalSubscriberDto, SubscribingWriterProfileDto, AllSubscriberDto, SubscriberDto} from "./dto";
import {AuthValidationService} from "../auth/auth.validation.service";
import {UtilService} from "../util/util.service";
import {ExceptionList} from "../response/error/errorInstances";
import {SubscribingWriterInfoWithUser} from "./prisma/subscribingWriterInfoWithUser.prisma.type";
import SubscribeDtoMapper from "./SubscribeDtoMapper";

@Injectable()
export class SubscribeService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authValidationService: AuthValidationService,
        private readonly utilService: UtilService,
    ) {}

    /**
     * @summary 외부 구독자 추가하기
     * @param writerId
     * @param followerEmail
     * @returns ExternalSubscriberDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws SUBSCRIBE_ALREADY_ERROR
     */
    async addExternalSubscriberByEmail(writerId: number, followerEmail: string): Promise<ExternalSubscriberDto> {
        await this.authValidationService.assertEmailUnique(followerEmail);
        try{
            const externalFollow = await this.prismaService.subscribeExternal.create({
                data: {
                    writerId,
                    followerEmail,
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
     * @summary 작가를 팔로우
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
     * @summary 해당 유저의 팔로잉 목록을 가져오기
     * @param followerId
     * @returns FollowingWriterProfileDto[]
     */
    async getSubscribingWriterListBySubscriberId(followerId : number): Promise<SubscribingWriterProfileDto[]> {
        const followingList: SubscribingWriterInfoWithUser[] = await this.prismaService.subscribe.findMany({
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
        if(followingList.length === 0) return [];
        return followingList.map(following => SubscribeDtoMapper.SubscribingWriterInfoWithUserToSubscribingWriterDto(following));
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
        const followerList = await this.getAllInternalSubscriberByWriterId(userId);
        try{
            await this.prismaService.writerInfo.update({
                where: {
                    userId
                },
                data : {
                    followerCount :followerList.length
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
     * @param followerEmail
     * @returns ExternalSubscriberDto
     * @throws SUBSCRIBER_NOT_FOUND
     */
    async deleteExternalSubscriberByEmail(writerId: number, followerEmail: string): Promise<ExternalSubscriberDto> {
        try{
            const externalFollow = await this.prismaService.subscribeExternal.delete({
                where: {
                    followerEmail_writerId: {
                        writerId,
                        followerEmail
                    }
                }
            })
            return SubscribeDtoMapper.SubscriberExternalToExternalSubscriberDto(externalFollow)
        }catch (error){
            throw ExceptionList.SUBSCRIBER_NOT_FOUND;
        }
    }

}

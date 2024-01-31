import {Injectable} from '@nestjs/common';
import {AuthValidationService} from "../auth/auth.validation.service";
import {PrismaService} from "../prisma/prisma.service";
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {ExceptionList} from "../response/error/errorInstances";
import {UtilService} from "../util/util.service";
import {UserIdentityDto} from "./dto/userIdentity.dto";

@Injectable()
export class UserService {
    constructor(
       private readonly authValidationService : AuthValidationService,
       private readonly prismaService: PrismaService,
       private readonly utilService: UtilService,
    ) {}

    /**
     * @summary 작가를 팔로우
     * @param followerId
     * @param writerId
     * @returns void
     * @throws FOLLOW_MYSELF_ERROR
     * @throws USER_NOT_WRITER
     * @throws FOLLOW_ALREADY_ERROR
     */
    async followWriter(followerId : number, writerId : number): Promise<void> {
        if(followerId === writerId) throw ExceptionList.FOLLOW_MYSELF_ERROR;
        await this.authValidationService.assertWriter(writerId);
        try {
            await this.prismaService.follow.create({
                data: {
                    followerId,
                    writerId,
                    createdAt : this.utilService.getCurrentDateInKorea()
                }
            });
        }catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                throw ExceptionList.FOLLOW_ALREADY_ERROR;
            }
        }
    }

    /**
     * @summary 해당 작가의 팔로워 목록을 가져오기
     * @param writerId
     * @returns userId[]
     */
    async getFollowerAllByUserId(writerId : number): Promise<number[] | null> {
        const followerList = await this.prismaService.follow.findMany({ // TODO : 팔로워가 유저 삭제가 되었는지 확인 필요
            where: {
                writerId
            },
            select:{
                followerId : true
            }
        })
        if(!followerList) return null;
        return followerList.map(follower => follower.followerId);
    }

    /**
     * @summary 해당 유저의 팔로잉 목록을 가져오기
     * @param followerId
     * @returns {userId, nickname}[] | []
     */
    async getFollowingUserListByUserId(followerId : number): Promise<UserIdentityDto[]> {
        const followingList = await this.prismaService.follow.findMany({
            where: {
                followerId
            },
            select:{
                writerId : true
            }
        })
        try {
            const followingIdList = followingList.map(following => following.writerId);
            return await this.getUserIdentityDataListByUserIdList(followingIdList);
        }catch (error) {
            console.log(error)
            return [];
        }
    }

    /**
     * @summary 유저 ID로 유저의 기본 정보 가져오기
     * @param userIdList
     * @returns {userId, nickname}[]
     * @throws EMPTY_LIST_INPUT
     */
    async getUserIdentityDataListByUserIdList(userIdList : number[]) : Promise<UserIdentityDto[]> {
        if (userIdList.length === 0) throw ExceptionList.EMPTY_LIST_INPUT;
        return this.prismaService.user.findMany({
            where: {
                id : {
                    in : userIdList
                },
                deleted : false,
            },
            select : {
                id : true,
                nickname : true,
            }
        })
    }

    /**
     * @summary 유저 ID로 작가의 유저 정보를 가져오기
     * @param writerIdList
     * @returns {userId, nickname}[]
     * @throws EMPTY_LIST_INPUT
     */
    async getUserIdentityDataListByWriterIdList(writerIdList : number[]) : Promise<UserIdentityDto[]> {
        if (writerIdList.length === 0) throw ExceptionList.EMPTY_LIST_INPUT;
        return this.prismaService.user.findMany({
            where: {
                id : {
                    in : writerIdList
                },
                deleted : false,
            },
            select : {
                id : true,
                nickname : true,
            }
        })
    }
}

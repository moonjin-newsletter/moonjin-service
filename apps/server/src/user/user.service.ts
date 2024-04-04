import {Injectable} from '@nestjs/common';
import {AuthValidationService} from "../auth/auth.validation.service";
import {PrismaService} from "../prisma/prisma.service";
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {ExceptionList} from "../response/error/errorInstances";
import {UtilService} from "../util/util.service";
import {UserIdentityDto, FollowingWriterProfileDto, UserDto, WriterDto, FollowerDto, ExternalFollowerDto} from "./dto";
import {UserRoleEnum} from "../auth/enum/userRole.enum";
import { WriterInfoDto} from "../auth/dto";
import UserDtoMapper from "./userDtoMapper";
import {WriterInfoWithUser} from "./prisma/writerInfo.prisma.type";
import * as process from "process";
import {IChangeUserProfile} from "./api-types/IChangeUserProfile";
import {FollowingWriterInfoWithUser} from "./prisma/followingWriterInfoWithUser.prisma.type";

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
     * @summary 작가 팔로우 취소
     * @param followerId
     * @param writerId
     * @returns void
     * @throws FOLLOW_MYSELF_ERROR
     * @throws USER_NOT_WRITER
     */
    async unfollowWriter(followerId : number, writerId : number): Promise<void> {
        if(followerId === writerId) throw ExceptionList.FOLLOW_MYSELF_ERROR;
        await this.authValidationService.assertWriter(writerId);
        try {
            await this.prismaService.follow.delete({ // TODO : 과거의 팔로우 기록을 남기는 방법이 필요한가 고민 필요
                where :{
                    followerId_writerId : {
                        followerId,
                        writerId
                    }
                }
            });
        }catch (error) {
            console.log(error);
        }
    }

    /**
     * @summary 외부 팔로워 목록 가져오기
     * @param writerId
     * @returns ExternalFollowerDto[]
     */
    async getExternalFollowerListByWriterId(writerId: number): Promise<ExternalFollowerDto[]> {
        const externalFollowerList = await this.prismaService.externalFollow.findMany({
            where: {
                writerId
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return externalFollowerList.map(externalFollower => UserDtoMapper.ExternalFollowerToExternalFollowerDto(externalFollower));
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
     * @returns FollowingWriterProfileDto[]
     */
    async getFollowingWriterListByFollowerId(followerId : number): Promise<FollowingWriterProfileDto[]> {
        const followingList: FollowingWriterInfoWithUser[] = await this.prismaService.follow.findMany({
            where: {
                followerId
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
        return followingList.map(following => {
            return UserDtoMapper.FollowingWriterInfoWithUserToFollowingWriterDto(following);
        })
    }

    /**
     * @summary 유저 ID로 작가 정보 가져오기
     * @param userIdList
     * @returns WriterInfoDto[]
     * @throws EMPTY_LIST_INPUT
     */
    async getWriterInfoListByUserIdList(userIdList : number[]) : Promise<WriterInfoDto[]> {
        if (userIdList.length === 0) throw ExceptionList.EMPTY_LIST_INPUT;
        return this.prismaService.writerInfo.findMany({
            where: {
                userId: {
                    in: userIdList
                },
                deleted: false,
            },
            select: {
                userId: true,
                moonjinId: true,
                description: true,
                newsletterCount: true,
                seriesCount: true,
                followerCount: true,
            }
        });
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

    /**
     * @summary 유저의 데이터 가져오기 (작가, 일반 유저 구분)
     * @param userId
     * @param role
     * @returns UserDto & WriterInfoDto?
     * @throws USER_NOT_FOUND
     * @throws USER_NOT_WRITER
     */
    async getUserData(userId : number, role : UserRoleEnum):Promise<{user:UserDto} | WriterDto> {
        if(role === UserRoleEnum.WRITER){
            const writer : WriterInfoWithUser | null = await this.prismaService.writerInfo.findUnique({
                where : {
                    userId,
                    deleted : false,
                },
                include :{
                    user : true
                },
                relationLoadStrategy: 'join',
            })
            if(!writer) throw ExceptionList.USER_NOT_WRITER;
            return UserDtoMapper.UserWithWriterInfoToUserAndWriterInfoDto(writer);
        }

        const user = await this.prismaService.user.findUnique({
            where : {
                id : userId,
                deleted : false,
            }
        })
        if(!user) throw ExceptionList.USER_NOT_FOUND;
        return {user : UserDtoMapper.UserToUserDto(user)};
    }


    /**
     * @summary 해당 유저가 존재하는 지 확인
     * @param userId
     * @returns void
     * @throws USER_NOT_FOUND
     */
    async assertUserExistById(userId : number): Promise<void>{
        const user = await this.prismaService.user.findUnique({
            where : {
                id : userId,
                deleted : false,
            }
        })
        if(!user) throw ExceptionList.USER_NOT_FOUND;
    }

    /**
     * @summary 해당 유저가 존재하는 지 확인
     * @param email
     * @returns {userId, email}
     * @throws USER_NOT_FOUND
     */
    async assertUserExistByEmail(email : string): Promise<{userId: number, email: string}>{
        const user = await this.prismaService.user.findUnique({
            where : {
                email,
                deleted : false,
            }
        })
        if(!user) throw ExceptionList.USER_NOT_FOUND;
        return {
            userId: user.id,
            email
        };
    }

    /**
     * @summary 해당 작가의 팔로워 목록 가져오기
     * @param writerId
     * @returns UserProfileDto[]
     */
    async getFollowerListByWriterId(writerId: number): Promise<FollowerDto[]> {
        const followerList = await this.prismaService.follow.findMany({
            where: {
                writerId,
                deleted: false,
            },
            include:{
                user : true
            },
            orderBy:{
                createdAt: 'desc'
            },
        })
        return followerList.map(follower => {
            return UserDtoMapper.FollowAndUserToFollowerDto(follower.user, follower.createdAt);
        })
    }

    /**
     * @summary 해당 작가가 존재하는 지 확인
     * @param moonjinId
     * @returns {userId, moonjinId}
     * @throws USER_NOT_WRITER
     */
    async assertWriterExistByMoonjinId(moonjinId: string): Promise<{userId: number, moonjinId :string}> {
        const writer = await this.prismaService.writerInfo.findUnique({
            where: {
                moonjinId
            }
        })
        if(!writer) throw ExceptionList.USER_NOT_FOUND;
        return {
            userId: writer.userId,
            moonjinId
        };
    }

    /**
     * @summary 팔로워 삭제하기
     * @param followerId
     * @param writerId
     * @returns void
     * @throws USER_NOT_FOUND
     * @throws FOLLOWER_NOT_FOUND
     */
    async deleteFollower(followerId: number, writerId: number): Promise<void> {
        await this.assertUserExistById(followerId);
        try {
             await this.prismaService.follow.update({
                where: {
                    followerId_writerId: {
                        writerId,
                        followerId
                    }
                },
                data: {
                    deleted: true
                }
            }) // update는 updateMany와 달리, 찾으려는 column이 없을 경우 에러를 발생시킵니다.
        }catch (error){
            console.log(error);
            throw ExceptionList.FOLLOWER_NOT_FOUND;
        }
    }

    /**
     * @summary 외부 팔로워 추가하기
     * @param writerId
     * @param followerEmail
     * @returns ExternalFollowerDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws FOLLOWER_ALREADY_EXIST
     */
    async addExternalFollowerByEmail(writerId: number, followerEmail: string): Promise<ExternalFollowerDto> {
        await this.authValidationService.assertEmailUnique(followerEmail);
        try{
            const follow = await this.prismaService.externalFollow.create({
                data: {
                    writerId,
                    followerEmail,
                    createdAt: this.utilService.getCurrentDateInKorea()
                }
            })
            return UserDtoMapper.ExternalFollowerToExternalFollowerDto(follow)
        }catch (error){
            console.log(error);
            throw ExceptionList.FOLLOWER_ALREADY_EXIST;
        }
    }

    /**
     * @summary 외부 팔로워 삭제하기
     * @param writerId
     * @param followerEmail
     * @returns ExternalFollowerDto
     * @throws FOLLOWER_NOT_FOUND
     */
    async deleteExternalFollowerByEmail(writerId: number, followerEmail: string): Promise<ExternalFollowerDto> {
        try{
            const externalFollow = await this.prismaService.externalFollow.delete({
                where: {
                    followerEmail_writerId: {
                        writerId,
                        followerEmail
                    }
                }
            })
            return UserDtoMapper.ExternalFollowerToExternalFollowerDto(externalFollow);
        }catch (error){
            throw ExceptionList.FOLLOWER_NOT_FOUND;
        }
    }

    /**
     * @summary email로 userId 가져오기 (moonjinEmail도 가능)
     * @param email
     * @returns userId
     * @throws USER_NOT_FOUND
     */
    async getUserIdByEmail(email: string): Promise<number> {
        const moonjinDomain = process.env.MAILGUN_DOMAIN?? '@moonjin';

        if(email.includes(moonjinDomain)){
            const moonjinId = email.split('@')[0];
            const writer = await this.prismaService.writerInfo.findUnique({
                where: {
                    moonjinId
                }
            })
            if(!writer) throw ExceptionList.USER_NOT_FOUND;
            return writer.userId;
        }else{
            const user = await this.prismaService.user.findUnique({
                where: {
                    email
                }
            })
            if(!user) throw ExceptionList.USER_NOT_FOUND;
            return user.id;
        }
    }

    /**
     * @summary 유저 프로필 변경하기
     * @param userId
     * @param newProfile
     * @returns UserDto
     * @throws NICKNAME_ALREADY_EXIST
     * @throws USER_NOT_FOUND
     */
    async changeUserProfile(userId: number, newProfile: IChangeUserProfile): Promise<UserDto> {
        try {
            const user = await this.prismaService.user.update({
                where: {
                    id: userId
                },
                data: {
                    nickname: newProfile.nickname
                }
            })
            return UserDtoMapper.UserToUserDto(user);
        }catch (error){
            if(error instanceof PrismaClientKnownRequestError){
                throw ExceptionList.NICKNAME_ALREADY_EXIST;
            }
            throw ExceptionList.USER_NOT_FOUND;
        }
    }

    /**
     * @summary 작가 뉴스레터 수 증가
     * @param userId
     * @returns void
     * @throws USER_NOT_WRITER
     */
    async synchronizeNewsLetter(userId : number): Promise<void> {
        try{
            await this.prismaService.writerInfo.update({
                where: {
                    userId
                },
                data: {
                    newsletterCount: {
                        increment: 1
                    }
                }
            })
        }catch (error){
            throw ExceptionList.USER_NOT_WRITER
        }
    }

    /**
     * @summary 작가 시리즈 수 증가
     * @param userId
     * @returns void
     * @throws USER_NOT_WRITER
     */
    async synchronizeSeries(userId :number) {
        try{
            await this.prismaService.writerInfo.update({
                where: {
                    userId
                },
                data: {
                    seriesCount: {
                        increment: 1
                    }
                }
            })
        }catch (error){
            throw ExceptionList.USER_NOT_WRITER
        }
    }

    // async changeProfileImage(userId: number, image: string): Promise<UserDto> {
    //
    // }
}

import {TypedBody, TypedParam, TypedRoute} from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {UserService} from "./user.service";
import {createResponseForm, ResponseForm} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {EMAIL_ALREADY_EXIST, USER_NOT_FOUND, USER_NOT_WRITER} from "../response/error/auth";
import {UserDto, FollowerDto, WriterDto, FollowingWriterDto, ExternalFollowerDto} from "./dto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {FOLLOWER_ALREADY_EXIST, FOLLOWER_NOT_FOUND} from "../response/error/user";
import {ICreateExternalFollower} from "./api-types/ICreateExternalFollower";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
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
        return createResponseForm({
            message: "팔로우 취소 성공"
        })
    }

    /**
     * @summary 유저의 팔로잉 작가 목록 가져오기
     * @param user
     * @returns FollowingWriterDto[]
     */
    @TypedRoute.Get("Following")
    @UseGuards(UserAuthGuard)
    async getFollowingUserList(@User() user : UserAuthDto) : Promise<ResponseForm<FollowingWriterDto[]>> {
        const followingWriterList = await this.userService.getFollowingWriterListByFollowerId(user.id);
        return createResponseForm(followingWriterList);
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
     * @summary 작가의 팔로워 목록 보기
     * @param user
     * @returns UserProfileDto[]
     */
    @TypedRoute.Get("follower")
    @UseGuards(WriterAuthGuard)
    async getFollowerList(@User() user : UserAuthDto) : Promise<Try<FollowerDto[]>> {
        const followingWriterList = await this.userService.getFollowerListByWriterId(user.id)
        return createResponseForm(followingWriterList);
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
     * @summary 외부 구독자 추가 API
     * @param user
     * @param followerData
     * @returns {message:string} & ExternalFollowerDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws FOLLOWER_ALREADY_EXIST
     */
    @TypedRoute.Post('follower/external')
    @UseGuards(WriterAuthGuard)
    async addExternalFollower(@User() user:UserAuthDto,@TypedBody() followerData : ICreateExternalFollower)
    :Promise<TryCatch<{message:string} & ExternalFollowerDto, EMAIL_ALREADY_EXIST | FOLLOWER_ALREADY_EXIST>>{
        const externalFollower = await this.userService.addExternalFollowerByEmail(user.id,followerData.followerEmail);
        return createResponseForm({
            message: "구독자 추가에 성공했습니다.",
            email : externalFollower.email,
            createdAt : externalFollower.createdAt
        })
    }
}

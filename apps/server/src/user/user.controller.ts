import {TypedParam, TypedRoute} from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto/userAuthDto";
import {UserService} from "./user.service";
import {createResponseForm, ResponseForm} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {USER_NOT_FOUND, USER_NOT_WRITER} from "../response/error/auth";
import {UserDto} from "./dto/user.dto";
import {FollowingWriterDto} from "./dto/followingWriter.dto";
import {WriterDto} from "./dto/writer.dto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {FollowerDto} from "./dto/follower.dto";
import {FOLLOW_MYSELF_ERROR, FOLLOWER_NOT_FOUND} from "../response/error/user";

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
     * @summary 팔로워 숨김 API
     * @param userId
     * @param writer
     * @returns
     * @throws USER_NOT_FOUND
     * @throws FOLLOW_MYSELF_ERROR
     * @throws FOLLOWER_NOT_FOUND
     */
    @TypedRoute.Patch(':id/hide')
    @UseGuards(WriterAuthGuard)
    async hideUser(@TypedParam("id") userId : number, @User() writer : UserAuthDto): Promise<TryCatch<{message:string},
    USER_NOT_FOUND | FOLLOW_MYSELF_ERROR | FOLLOWER_NOT_FOUND>> {
        await this.userService.hideFollower(userId, writer.id);
        return createResponseForm({
            message: "유저 숨김 성공"
        })
    }
}

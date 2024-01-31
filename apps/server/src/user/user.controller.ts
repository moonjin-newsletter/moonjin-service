import {TypedParam, TypedRoute} from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserDto} from "../auth/dto/user.dto";
import {UserService} from "./user.service";
import {createResponseForm, ResponseForm} from "../response/responseForm";
import {UserIdentityDto} from "./dto/userIdentity.dto";
import {TryCatch} from "../response/tryCatch";
import {WriterInfoDto} from "../auth/dto/writerInfoDto";
import {USER_NOT_FOUND, USER_NOT_WRITER} from "../response/error/auth";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    /**
     * @summary 팔로우 기능
     * @param writerId
     * @param user
     */
    @TypedRoute.Post("Follow/:id")
    @UseGuards(UserAuthGuard)
    async follow(@TypedParam("id") writerId : number, @User() user : UserDto) {
        await this.userService.followWriter(user.id, writerId);
        return createResponseForm({
            message: "팔로우 성공"
        })
    }

    /**
     * @summary 유저의 팔로잉 유저 목록 가져오기
     * @param user
     */
    @TypedRoute.Get("Following")
    @UseGuards(UserAuthGuard)
    async getFollowingUserList(@User() user : UserDto) : Promise<ResponseForm<UserIdentityDto[]>> {
        const followingUserList = await this.userService.getFollowingUserListByUserId(user.id);
        return createResponseForm(followingUserList);
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
    async getUser(@User() user : UserDto): Promise<TryCatch<{user:UserDto, writer?: WriterInfoDto},
    USER_NOT_FOUND | USER_NOT_WRITER>>
    {
        const userData = await this.userService.getUserData(user.id, user.role);
        return createResponseForm(userData);
    }
}

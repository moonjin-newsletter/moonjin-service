import {TypedParam, TypedRoute} from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserDto} from "../auth/dto/user.dto";
import {UserService} from "./user.service";
import {createResponseForm, ResponseForm} from "../response/responseForm";
import {UserIdentityDto} from "./dto/userIdentity.dto";

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

    @TypedRoute.Get("Following")
    @UseGuards(UserAuthGuard)
    async getFollowingUserList(@User() user : UserDto) : Promise<ResponseForm<UserIdentityDto[]>> {
        const followingUserList = await this.userService.getFollowingUserListByUserId(user.id);
        return createResponseForm(followingUserList);
    }
}

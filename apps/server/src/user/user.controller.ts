import {TypedParam, TypedRoute} from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserDto} from "../auth/dto/user.dto";
import {UserService} from "./user.service";
import {createResponseForm} from "../response/responseForm";

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
}

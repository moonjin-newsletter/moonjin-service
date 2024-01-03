import {Controller } from '@nestjs/common';
import {TypedBody, TypedRoute} from '@nestia/core';
import { ICreateUser} from "./api-types/createUser.type";

@Controller('user')
export class UserController {
  @TypedRoute.Post()
  async createUser(@TypedBody() createUserData: ICreateUser) {
    return createUserData;
  }
}

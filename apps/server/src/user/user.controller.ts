import {Body, Controller, Post} from '@nestjs/common';
import { type CreateUserTypes } from "@moonjin/api-types"

@Controller('user')
export class UserController {
  @Post()
  async createUser(@Body() createUserData : CreateUserTypes) {
    return createUserData;
  }
}

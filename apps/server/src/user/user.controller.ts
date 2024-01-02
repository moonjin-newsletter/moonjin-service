import {Body, Controller, Post} from '@nestjs/common';
import {CreateUser} from "@moonjin/api-types";

@Controller('user')
export class UserController {
  @Post()
  async createUser(@Body() createUserData: CreateUser) {
    return createUserData;
  }
}

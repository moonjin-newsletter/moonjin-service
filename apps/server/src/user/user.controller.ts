import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  public async createUser(
    @Body('email') email: string,
    @Body('name') name: string
  ) {
    return await this.userService.join(email, name);
  }
}

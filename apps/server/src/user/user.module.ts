import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {AuthModule} from "../auth/auth.module";
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports:[
      AuthModule,
      PrismaModule
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}

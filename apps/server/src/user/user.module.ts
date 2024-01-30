import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {AuthModule} from "../auth/auth.module";
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";

@Module({
  imports:[
      AuthModule,
      PrismaModule,
      UtilModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports : [UserService]
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";
import {EventEmitter2} from "@nestjs/event-emitter";

@Module({
  imports: [
      PrismaModule,
      UtilModule
  ],
  controllers: [UserController],
  providers: [UserService, EventEmitter2]
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";
import {MailModule} from "../mail/mail.module";

@Module({
  imports: [
      PrismaModule,
      UtilModule,
      MailModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";
import {MailModule} from "../mail/mail.module";
import {OauthService} from "./oauth.service";
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
      PrismaModule,
      UtilModule,
      MailModule,
      HttpModule
  ],
  controllers: [UserController],
  providers: [UserService, OauthService]
})
export class UserModule {}

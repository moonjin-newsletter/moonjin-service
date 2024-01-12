import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
  controllers: [AuthController],
  providers: [AuthService, OauthService]
})
export class AuthModule {}

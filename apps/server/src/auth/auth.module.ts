import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";
import {MailModule} from "../mail/mail.module";
import {OauthService} from "./oauth.service";
import { HttpModule } from '@nestjs/axios';
import {AuthValidationService} from "./auth.validation.service";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
      JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
              secret: config.get<string>('JWT_SECRET'),
          }),
      }),
      PrismaModule,
      UtilModule,
      MailModule,
      HttpModule
  ],
  controllers: [AuthController],
  providers: [AuthService, OauthService, AuthValidationService],
    exports : [AuthService, AuthValidationService, OauthService]
})
export class AuthModule {}

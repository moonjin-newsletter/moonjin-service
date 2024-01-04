import { Module } from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {UtilService} from "./util.service";
import {JwtGaurdFromCookie} from "./jwt.strategy";

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'util'}),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>('JWT_SECRET'),
        }),
      })
  ],
  providers: [UtilService, JwtGaurdFromCookie],
  exports: [UtilService, JwtGaurdFromCookie]

})
export class UtilModule {}

import { Module } from '@nestjs/common';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import {UserModule} from "../user/user.module";
import {AuthModule} from "../auth/auth.module";
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";

@Module({
  imports: [
      UserModule,
      AuthModule,
      PrismaModule,
      UtilModule
  ],
  controllers: [LetterController],
  providers: [LetterService]
})
export class LetterModule {}

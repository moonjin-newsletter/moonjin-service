import { Module } from '@nestjs/common';
import { WriterInfoController } from './writerInfo.controller';
import { WriterInfoService } from './writerInfo.service';
import {UserModule} from "../user/user.module";
import {PrismaModule} from "../prisma/prisma.module";
import {AuthModule} from "../auth/auth.module";
import {UtilModule} from "../util/util.module";
import {MailModule} from "../mail/mail.module";

@Module({
  imports: [
      UtilModule,
      UserModule,
      MailModule,
      PrismaModule,
      AuthModule
  ],
  controllers: [WriterInfoController],
  providers: [WriterInfoService],
  exports : [WriterInfoService]
})
export class WriterInfoModule {}

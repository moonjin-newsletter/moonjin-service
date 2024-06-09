import { Module } from '@nestjs/common';
import { WriterController } from './writer.controller';
import { WriterService } from './writer.service';
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
  controllers: [WriterController],
  providers: [WriterService],
  exports : [WriterService]
})
export class WriterModule {}

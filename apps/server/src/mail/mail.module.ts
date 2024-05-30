import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { UtilModule } from 'src/util/util.module';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports: [UtilModule, PrismaModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}

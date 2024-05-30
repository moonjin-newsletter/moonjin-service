import { Module } from '@nestjs/common';
import { MailgunService } from './mailgun.service';
import { MailgunController } from './mailgun.controller';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports:[PrismaModule],
  providers: [MailgunService],
  controllers: [MailgunController]
})
export class MailgunModule {}

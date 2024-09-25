import { Module } from '@nestjs/common';
import { WriterController } from './writer.controller';
import { WriterService } from './writer.service';
import {NewsletterModule} from "../newsletter/newsletter.module";
import {SubscribeModule} from "../subscribe/subscribe.module";
import {WriterInfoModule} from "../writerInfo/writerInfo.module";
import {SeriesModule} from "../series/series.module";
import {UserModule} from "../user/user.module";
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports: [
      NewsletterModule,
      SubscribeModule,
      WriterInfoModule,
      SeriesModule,
      UserModule,
      PrismaModule
  ],
  controllers: [WriterController],
  providers: [WriterService]
})
export class WriterModule {}

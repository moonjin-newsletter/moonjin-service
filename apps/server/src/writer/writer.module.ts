import { Module } from '@nestjs/common';
import { WriterController } from './writer.controller';
import { WriterService } from './writer.service';
import {NewsletterModule} from "../newsletter/newsletter.module";
import {SubscribeModule} from "../subscribe/subscribe.module";
import {WriterInfoModule} from "../writerInfo/writerInfo.module";

@Module({
  imports: [
      NewsletterModule,
      SubscribeModule,
      WriterInfoModule
  ],
  controllers: [WriterController],
  providers: [WriterService]
})
export class WriterModule {}

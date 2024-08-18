import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import {AuthModule} from "../auth/auth.module";
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";
import {UserModule} from "../user/user.module";
import {SubscribeModule} from "../subscribe/subscribe.module";
import {WriterInfoModule} from "../writerInfo/writerInfo.module";

@Module({
  imports: [
      PrismaModule,
      AuthModule,
      UtilModule,
      UserModule,
      SubscribeModule,
      WriterInfoModule
  ],
  providers: [SeriesService],
  controllers: [SeriesController],
    exports: [SeriesService]
})
export class SeriesModule {}

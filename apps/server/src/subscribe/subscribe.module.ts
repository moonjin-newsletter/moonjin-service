import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";
import {UserModule} from "../user/user.module";
import {WriterInfoModule} from "../writerInfo/writerInfo.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
      PrismaModule,
      UtilModule,
      UserModule,
      WriterInfoModule,
      AuthModule
  ],
  controllers: [SubscribeController],
  providers: [SubscribeService],
    exports: [SubscribeService]
})
export class SubscribeModule {}

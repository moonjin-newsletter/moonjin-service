import { Module } from '@nestjs/common';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";
import {UserModule} from "../user/user.module";
import {WriterModule} from "../writer/writer.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
      PrismaModule,
      UtilModule,
      UserModule,
      WriterModule,
      AuthModule
  ],
  controllers: [SubscribeController],
  providers: [SubscribeService],
    exports: [SubscribeService]
})
export class SubscribeModule {}

import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import {AuthModule} from "../auth/auth.module";
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";
import {UserModule} from "../user/user.module";

@Module({
  imports: [
      PrismaModule,
      AuthModule,
      UtilModule,
      UserModule
  ],
  providers: [SeriesService],
  controllers: [SeriesController],
    exports: [SeriesService]
})
export class SeriesModule {}

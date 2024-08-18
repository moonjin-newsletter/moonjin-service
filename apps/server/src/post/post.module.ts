import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";
import {AuthModule} from "../auth/auth.module";
import {SeriesModule} from "../series/series.module";
import {UserModule} from "../user/user.module";
import {MailModule} from "../mail/mail.module";
import {WriterInfoModule} from "../writerInfo/writerInfo.module";

@Module({
  imports: [
      PrismaModule,
      UtilModule,
      AuthModule,
      SeriesModule,
      UserModule,
      MailModule,
      WriterInfoModule
  ],
  providers: [PostService],
  controllers: [PostController],
    exports: [PostService]
})
export class PostModule {}

import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import {MailModule} from "../mail/mail.module";
import {AuthModule} from "../auth/auth.module";
import {PostModule} from "../post/post.module";
import {PrismaModule} from "../prisma/prisma.module";
import {UtilModule} from "../util/util.module";
import {WriterModule} from "../writer/writer.module";
import {UserModule} from "../user/user.module";
import {SubscribeModule} from "../subscribe/subscribe.module";

@Module({
  imports:[
      PrismaModule,
      UtilModule,
      AuthModule,
      MailModule,
      PostModule,
      WriterModule,
      UserModule,
      SubscribeModule
  ],
  providers: [NewsletterService],
  controllers: [NewsletterController]
})
export class NewsletterModule {}

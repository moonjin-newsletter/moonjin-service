import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UtilModule } from './util/util.module';
import { MailModule } from './mail/mail.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { SeriesModule } from './series/series.module';
import { LetterModule } from './letter/letter.module';
import { AwsModule } from './aws/aws.module';
import { FileModule } from './file/file.module';
import { SubscribeModule } from './subscribe/subscribe.module';
import { WriterModule } from './writer/writer.module';
import { NewsletterModule } from './newsletter/newsletter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env.dev.local',
    }),
    AuthModule,
    PrismaModule,
    UtilModule,
    MailModule,
    EventEmitterModule.forRoot(),
    PostModule,
    UserModule,
    SeriesModule,
    LetterModule,
    AwsModule,
    FileModule,
    SubscribeModule,
    WriterModule,
    NewsletterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

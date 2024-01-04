import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [UtilModule],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}

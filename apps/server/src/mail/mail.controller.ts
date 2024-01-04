import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { OnEvent } from '@nestjs/event-emitter';
import { newsLetterValidationDto } from './dto/mail.dto';

@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('newsletter')
  async sendNewsLetter(@Body('') emailInfo: newsLetterValidationDto) {
    await this.mailService.sendNewsLetter(emailInfo);
    return 'News letters sended';
  }

  @Get('test')
  async mailTest() {
    return 'ok';
  }

  @OnEvent('mail-verification')
  handleMailVerification(payload: { email: string; accessLink: string }) {
    this.mailService.sendVerificationMail(payload.email, payload.accessLink);
  }
}

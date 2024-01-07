import {
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { OnEvent } from '@nestjs/event-emitter';
import { newsLetterValidationDto } from './dto/mail.dto';
import {TypedBody} from "@nestia/core";

@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('newsletter')
  async sendNewsLetter(@TypedBody() emailInfo: newsLetterValidationDto) {
    await this.mailService.sendNewsLetter(emailInfo);
    return 'News letters sended';
  }

  @Get('test')
  async mailTest() {
    return 'ok';
  }

  @OnEvent('mail-verification')
  handleMailVerification(payload: { email: string; accessLink: string }) {
    console.log("send " + payload.accessLink + " To " + payload.email);
    // this.mailService.sendVerificationMail(payload.email, payload.accessLink);
  }
}

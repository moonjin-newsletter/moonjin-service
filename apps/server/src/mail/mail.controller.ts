import {
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { newsLetterValidationDto } from './dto';
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
}

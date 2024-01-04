import { BadRequestException, Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import { newsLetterDto } from './dto/mail.dto';

@Injectable()
export class MailService {
  private MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN ? process.env.MAILGUN_DOMAIN : "mailgun-domain";
  private MAILGUN_API_KEY = process.env.MAILGUN_API_KEY_FOR_SENDING ? process.env.MAILGUN_API_KEY_FOR_SENDING : "mailgun-api-key";
  private mailgunClient = new Mailgun(FormData).client({
    username: 'api',
    key: this.MAILGUN_API_KEY,
  });

  async sendVerificationMail(
    email: string,
    accessLink: string
  ): Promise<boolean> {
    try {
      await this.mailgunClient.messages.create(this.MAILGUN_DOMAIN, {
        from: `문진 <admin@${this.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: '[문진] 회원가입 인증 메일입니다.',
        html: `
        <h2>메일 인증을 위해 해당 링크를 클릭해주세요 <a href="${accessLink}">메일 인증하기</a></h2>
        `,
        'o:tracking': 'yes',
      });
      return true;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error : The email does not exists');
    }
  }

  async sendNewsLetter(mailInfo: newsLetterDto): Promise<boolean> {
    try {
      await this.mailgunClient.messages.create(this.MAILGUN_DOMAIN, {
        from: `${mailInfo.senderName} <${mailInfo.senderMailAddress}>`,
        to: `moonjin-newsletter@${this.MAILGUN_DOMAIN}`,
        bcc: mailInfo.emailList,
        subject: mailInfo.subject,
        template: mailInfo.templateName,
        'o:tracking': 'yes',
      });
      return true;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error : The email does not exists');
    }
  }
}

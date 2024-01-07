import {  Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import { newsLetterDto } from './dto/mail.dto';
import * as process from "process";
import FormData from "form-data";
import {ExceptionList} from "../response/error/errorInstances";

@Injectable()
export class MailService {
  private MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN ? process.env.MAILGUN_DOMAIN : "mailgun-domain";
  private MAILGUN_API_KEY = process.env.MAILGUN_API_KEY_FOR_SENDING ? process.env.MAILGUN_API_KEY_FOR_SENDING : "mailgun-api-key";
  private mailgunClient = new Mailgun(FormData).client({
    username: 'api',
    key: this.MAILGUN_API_KEY,
  });

  /**
   * @summary 해당 email을 인증해주는 기능
   * 해당 메일에 인증 code 가 담긴 링크를 보낸다.
   * @param email
   * @param code
   * @throws MAIL_NOT_EXISTS
   */
  async sendVerificationMail(
    email: string,
    code : string
  ): Promise<void> {
    const accessLink = process.env.SERVER_URL + "/user/email/verification?code=" + code;
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
    } catch (error) {
      console.log(error);
      throw ExceptionList.EMAIL_NOT_EXIST;
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
      throw ExceptionList.EMAIL_NOT_EXIST
    }
  }
}

import {  Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import { newsLetterDto, sendNewsLetterWithHtmlDto } from './dto';
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
  async sendSignupVerificationMail(
    email: string,
    code : string
  ): Promise<void> {
    const accessLink = process.env.SERVER_URL + "/auth/signup/email/verification?code=" + code;
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

  /**
   * @summary 해당 email을 인증해주는 기능
   * 해당 메일에 인증 code 가 담긴 링크를 보낸다.
   * @param email
   * @param code
   * @throws EMAIL_NOT_EXIST
   */
  async sendMailForPasswordChangePage(
      email: string,
      code : string
  ): Promise<void> {
    const accessLink = process.env.SERVER_URL + "/auth/password/email/verification?code=" + code;
    try {
      await this.mailgunClient.messages.create(this.MAILGUN_DOMAIN, {
        from: `문진 <admin@${this.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: '[문진] 패스워드 변경을 위한 인증 메일입니다.',
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

  /**
   * @summary 해당 email을 인증해주는 기능
   * 해당 메일에 인증 code 가 담긴 링크를 보낸다.
   * @param email
   * @param code
   * @throws EMAIL_NOT_EXIST
   */
  async sendMailForPasswordChange(
      email: string,
      code : string
  ): Promise<void> {
    const accessLink = process.env.SERVER_URL + "/user/password/change?code=" + code;
    try {
      await this.mailgunClient.messages.create(this.MAILGUN_DOMAIN, {
        from: `문진 <admin@${this.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: '[문진] 패스워드 변경을 위한 인증 메일입니다.',
        html: `
        <h2>메일 인증을 위해 해당 링크를 클릭해주세요 <a href="${accessLink}">패스워드 변경하기</a></h2>
        `,
        'o:tracking': 'yes',
      });
    } catch (error) {
      console.log(error);
      throw ExceptionList.EMAIL_NOT_EXIST;
    }
  }

  /**
   *
   * @param mailInfo
   */
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

  /**
   * @summary 해당 emailList에게 html 뉴스레터를 보내는 기능
   * @param mailInfo
   * @throws SEND_NEWSLETTER_ERROR
   */
  async sendNewsLetterWithHtml(mailInfo: sendNewsLetterWithHtmlDto): Promise<void> {
    try {
      const recipientVariables= this.getRecipientVariables(mailInfo.emailList);
      await this.mailgunClient.messages.create(this.MAILGUN_DOMAIN, {
        from: `${mailInfo.senderName} <${mailInfo.senderMailAddress}>`,
        to: mailInfo.emailList,
        subject: mailInfo.subject,
        'recipient-variables': JSON.stringify(recipientVariables),
        html: mailInfo.html,
        'o:tracking': 'yes',
        "v:newsletter-id": mailInfo.newsletterId.toString(),
      });
    } catch (error) {
      console.log(error);
      throw ExceptionList.SEND_NEWSLETTER_ERROR;
    }
  }

  async getEventsByMessagesSendResult(messageId: string){
    return await this.mailgunClient.events.get(this.MAILGUN_DOMAIN, {
        'message-id': messageId,
        // end: "1716987800.9048312"
    })
  }

  getRecipientVariables(emailList : string[]) {
    let idx=0;
    return Object.assign({}, ...emailList.map((email) => {
      idx++;
      return {[email]: {"id": idx}}
    }));
  }
}

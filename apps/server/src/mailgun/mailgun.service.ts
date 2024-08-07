import {Injectable} from "@nestjs/common";
import * as crypto from "crypto";
import {CreateNewsletterSendEvent, MailgunWebhookSignature} from "./dto";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class MailgunService {
    private MAILGUN_SIGNING_KEY = process.env.MAILGUN_SIGNING_KEY?? 'mailgun-signing-key';
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    verify(mailgunWebhookSignature :MailgunWebhookSignature):boolean{
        const encodedToken = crypto
            .createHmac('sha256', this.MAILGUN_SIGNING_KEY)
            .update(mailgunWebhookSignature.timestamp.concat(mailgunWebhookSignature.token))
            .digest('hex')

        return (encodedToken === mailgunWebhookSignature.signature)
    }

    /**
     * @summary 뉴스레터 WebHook 이벤트를 저장하는 함수
     * @param newsletterSendEventData
     */
    async saveNewsletterSendEvent(newsletterSendEventData : CreateNewsletterSendEvent): Promise<boolean>{
        try{
            const mailNewsletter = await this.prismaService.mailNewsletter.findFirstOrThrow({
                where : {
                    newsletterSendId : newsletterSendEventData.newsletterId,
                    receiverEmail : newsletterSendEventData.receiverEmail
                }
            })
            await this.prismaService.newsletterAnalytics.create({
                data: {
                    id:newsletterSendEventData.id,
                    event:newsletterSendEventData.event,
                    timestamp:newsletterSendEventData.timestamp,
                    mailNewsletterId : mailNewsletter.id,
                }
            })
            return true;
        }catch (error){
            return false;
        }
    }

}

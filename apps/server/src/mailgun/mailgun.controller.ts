import {Controller, UseGuards} from "@nestjs/common";
import { TypedRoute} from "@nestia/core";
import {createResponseForm} from "../response/responseForm";
import {MailgunService} from "./mailgun.service";
import {getMailEventsEnumByString} from "../mail/enum/sendMailEvents.enum";
import {IMailgunWebhookPayload} from "./api-types/IMailgunWebhookPayload";
import {MailgunWebhookGuard} from "./guard/mailgun-webhook-guard.service";
import {WebhookPayload} from "./decorator/webhook.decorator";

@Controller('mailgun')
export class MailgunController {
    constructor(
        private readonly mailgunService: MailgunService
    ) {}

    @TypedRoute.Post("webhook/:event")
    @UseGuards(MailgunWebhookGuard)
    async webhookHandler(@WebhookPayload() webhookPayload : IMailgunWebhookPayload){
        console.log(webhookPayload.eventData);
        if(Number(webhookPayload.eventData["user-variables"]["newsletter-id"]) != 0){
            const createSendEventDto = {
                id: webhookPayload.eventData.id,
                newsletterId: Number(webhookPayload.eventData["user-variables"]["newsletter-id"]),
                event: getMailEventsEnumByString(webhookPayload.eventData.event),
                receiverEmail: webhookPayload.eventData.recipient,
                timestamp: new Date(webhookPayload.eventData.timestamp * 1000)
            }
            await this.mailgunService.saveNewsletterSendEvent(createSendEventDto);
        }

        return createResponseForm("ok");
    }
}
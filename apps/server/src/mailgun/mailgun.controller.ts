import {Controller, UseGuards} from "@nestjs/common";
import {TypedBody, TypedParam, TypedRoute} from "@nestia/core";
import {createResponseForm} from "../response/responseForm";
import {IMailgunWebhookPayload} from "./api-types/IMailgunWebhookPayload";
import {MailgunWebhookGuard} from "./guard/mailgun-webhook-guard.service";
import {MailgunService} from "./mailgun.service";
import {getMailEventsEnumByString} from "../mail/enum/sendMailEvents.enum";

@Controller('mailgun')
export class MailgunController {
    constructor(
        private readonly mailgunService: MailgunService
    ) {}

    @TypedRoute.Post("webhook/failed/:type")
    @UseGuards(MailgunWebhookGuard)
    async webhookPermanentFailed(@TypedBody() body:IMailgunWebhookPayload){
        console.log(body["event-data"])
        return createResponseForm(body);
    }

    @TypedRoute.Post("webhook/:event")
    @UseGuards(MailgunWebhookGuard)
    async webhookHandler(@TypedBody() payload:IMailgunWebhookPayload, @TypedParam("event") event:string){
        console.log(event)
        console.log(payload["event-data"]);
        const newsletterId = payload["event-data"]["user-variables"]["newsletter-id"] as number;

        await this.mailgunService.saveNewsletterSendEvent({
            id: payload["event-data"].id,
            event : getMailEventsEnumByString(payload["event-data"].event),
            receiverEmail : payload["event-data"].recipient,
            newsletterId,
            timestamp : new Date(payload["event-data"].timestamp)
        })
        return createResponseForm("ok");
    }
}
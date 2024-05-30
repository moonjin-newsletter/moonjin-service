import {MailgunWebhookSignature} from "../dto";
import {DomainEvent} from "mailgun.js";

export interface IMailgunWebhookPayload {
    'signature': MailgunWebhookSignature,
    'event-data': DomainEvent
}
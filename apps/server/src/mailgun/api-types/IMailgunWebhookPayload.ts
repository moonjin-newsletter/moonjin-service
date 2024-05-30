import {MailgunWebhookSignature} from "../dto";
import {IMailgunEventData} from "./IMailgunEventData";

export interface IMailgunWebhookPayload {
    signature: MailgunWebhookSignature,
    eventData: IMailgunEventData,
}
import {SendMailEventsEnum} from "../../mail/enum/sendMailEvents.enum";

export interface CreateNewsletterSendEvent{
    id: string;
    newsletterId: number;
    event: SendMailEventsEnum;
    receiverEmail: string;
    timestamp: Date;
}
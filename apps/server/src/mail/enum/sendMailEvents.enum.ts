

export enum SendMailEventsEnum {
    accepted,rejected, delivered, opened, clicked, failed, unsubscribed, complained, else
}

export function getMailEventsEnumByString(event: string) :SendMailEventsEnum{
    switch (event) {
        case "accepted": return SendMailEventsEnum.accepted;
        case "rejected": return SendMailEventsEnum.rejected;
        case "delivered": return SendMailEventsEnum.delivered;
        case "opened": return SendMailEventsEnum.opened;
        case "clicked": return SendMailEventsEnum.clicked;
        case "failed": return SendMailEventsEnum.failed;
        case "unsubscribed": return SendMailEventsEnum.unsubscribed;
        case "complained": return SendMailEventsEnum.complained;
        default: return SendMailEventsEnum.else;
    }
}
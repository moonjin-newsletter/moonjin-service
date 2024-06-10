import {NewsletterCardDto} from "./newsletterCard.dto";

export interface SendNewsletterResultDto extends NewsletterCardDto{
    analytics : {
        deliveredCount: number;
        totalSentCount: number;
    }
}
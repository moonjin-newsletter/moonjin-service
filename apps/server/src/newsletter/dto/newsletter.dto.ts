import {NewsletterUserInteractionDto} from "./newsletterUserInteraction.dto";

export interface NewsletterDto extends NewsletterUserInteractionDto{
    id: number;
    postId: number;
    postContentId: number;
    sentAt: Date;
}
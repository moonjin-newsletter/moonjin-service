import {NewsletterSummaryDto} from "./newsletterSummary.dto";


export interface SendNewsletterResultDto extends NewsletterSummaryDto{
    deliveredCount: number;
    totalSentCount: number;
}
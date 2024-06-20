import {NewsletterSummaryDto} from "./newsletterSummary.dto";
import {SeriesDto} from "../../series/dto";
import {WriterProfileInCardDto} from "../../writerInfo/dto";
import {PostInNewsletterCardDto} from "../../post/dto";

export interface NewsletterCardDto {
    newsletter : NewsletterSummaryDto,
    post :PostInNewsletterCardDto,
    series : SeriesDto | null,
    writer : WriterProfileInCardDto
}
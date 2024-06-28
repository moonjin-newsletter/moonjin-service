import {SeriesDto} from "../../series/dto";
import {WriterProfileInCardDto} from "../../writerInfo/dto";
import {PostDto} from "../../post/dto";
import {NewsletterDto} from "./newsletter.dto";

export interface NewsletterCardDto {
    newsletter : NewsletterDto,
    post : PostDto,
    series : SeriesDto | null,
    writer : WriterProfileInCardDto
}
import {PostWithContentDto} from "../../post/dto";
import { WriterProfileDto} from "../../writerInfo/dto";
import {SeriesDto} from "../../series/dto";
import {NewsletterDto} from "./newsletter.dto";

export interface NewsletterAllDataDto extends PostWithContentDto{
    newsletter : NewsletterDto,
    series : SeriesDto | null,
    writer : WriterProfileDto
}
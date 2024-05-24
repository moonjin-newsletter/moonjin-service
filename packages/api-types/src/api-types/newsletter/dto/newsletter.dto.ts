import {ReleasedPostWithWriterDto} from "../../post/dto";
import {SeriesDto} from "../../series/dto";

export interface NewsletterDto extends ReleasedPostWithWriterDto {
    series : SeriesDto | null
}
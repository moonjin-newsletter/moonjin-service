import {NewsletterDto} from "./newsletter.dto";
import {PaginationMetaDataDto} from "../../common/dto";

export interface NewsletterListWithPaginationDto {
    newsletters: NewsletterDto[];
    paginationMetaData: PaginationMetaDataDto;
}
import {NewsletterDto} from "../../newsletter/dto";
import {PaginationMetaDataDto} from "../../common/pagination/dto";

export interface NewsletterListWithPaginationDto {
    newsletters: NewsletterDto[];
    paginationMetaData: PaginationMetaDataDto;
}
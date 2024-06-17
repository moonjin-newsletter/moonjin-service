import {NewsletterCardDto} from "./newsletterCard.dto";
import {PaginationMetaDataDto} from "../../common/pagination/dto";

export interface NewsletterCardListWithPaginationDto {
    newsletterCardList: NewsletterCardDto[];
    pagination : PaginationMetaDataDto
}
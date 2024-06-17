import {PaginationOptionsDto} from "./paginationOptionsDto";

export interface PaginationMetaDataDto {
    next: PaginationOptionsDto
    totalCount: number;
    isLastPage: boolean;
}
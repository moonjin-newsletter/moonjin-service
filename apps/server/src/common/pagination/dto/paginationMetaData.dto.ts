export interface PaginationMetaDataDto {
    next: {
        pageNo : number;
        cursor : number;
    }
    totalCount: number;
    isLastPage: boolean;
}
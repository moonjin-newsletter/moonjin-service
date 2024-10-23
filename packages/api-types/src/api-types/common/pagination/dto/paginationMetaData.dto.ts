export interface PaginationMetaDataDto {
    next: {
        pageNo : number;
        cursor : number;
        take : number;
    }
    totalCount: number;
    isLastPage: boolean;
}
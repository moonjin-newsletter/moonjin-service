export interface PaginationOptionsDto {
    skip: number;
    take: number;
    pageNo : number;
    cursor?: number;
}
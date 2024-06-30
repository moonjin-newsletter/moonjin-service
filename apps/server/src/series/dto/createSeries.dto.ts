export interface CreateSeriesDto {
    title: string;
    writerId : number;
    category : string;
    cover? : string;
    description? : string;
}
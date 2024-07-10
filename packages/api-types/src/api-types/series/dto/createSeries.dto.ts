export interface CreateSeriesDto {
    title: string;
    writerId : number;
    category : number;
    cover? : string;
    description? : string;
}
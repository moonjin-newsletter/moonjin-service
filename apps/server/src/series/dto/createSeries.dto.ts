export interface CreateSeriesDto {
    title: string;
    writerId : number;
    category : string;
    status : boolean;
    cover? : string;
    description? : string;
}
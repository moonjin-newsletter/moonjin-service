export interface SeriesDto {
    id : number;
    title: string;
    writerId : number;
    category : string;
    clicks : number;
    status : boolean;
    cover : string | null;
    description : string | null;
}
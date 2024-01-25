export interface SeriesDto {
    id : number;
    title: string;
    writerId : number;
    category : string;
    status : boolean;
    cover : string | null;
    description : string | null;
    releasedAt : Date | null;
}
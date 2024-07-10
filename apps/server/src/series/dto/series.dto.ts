import {SeriesUserInteractionDto} from "./seriesUserInteraction.dto";

export interface SeriesDto extends SeriesUserInteractionDto {
    id : number;
    title: string;
    writerId : number;
    cover : string;
    category : string;
    description : string;
    createdAt : Date;
    lastUpdatedAt : Date;
}
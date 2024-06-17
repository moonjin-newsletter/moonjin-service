import {SeriesSummaryDto} from "./seriesSummary.dto";

export interface SeriesDto extends SeriesSummaryDto {
    writerId : number;
    category : string;
    clicks : number;
    status : boolean;
    description : string | null;
    lastUpdatedAt : Date;
}
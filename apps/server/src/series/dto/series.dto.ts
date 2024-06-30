import {SeriesSummaryDto} from "./seriesSummary.dto";

export interface SeriesDto extends SeriesSummaryDto {
    writerId : number;
    category : string;
    clicks : number;
    description : string | null;
    lastUpdatedAt : Date;
}
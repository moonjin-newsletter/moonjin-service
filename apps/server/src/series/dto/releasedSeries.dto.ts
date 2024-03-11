import {SeriesDto} from "./series.dto";

export interface ReleasedSeriesDto extends SeriesDto{
    releasedAt : Date;
}
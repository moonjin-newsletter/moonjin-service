import { UserProfileDto} from "../../user/dto";
import {ReleasedSeriesDto} from "./releasedSeries.dto";

export interface ReleasedSeriesWithWriterDto {
    series: ReleasedSeriesDto;
    writer: UserProfileDto;
}
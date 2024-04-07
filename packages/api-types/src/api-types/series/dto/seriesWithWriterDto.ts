import { UserProfileDto} from "../../user/dto";
import {SeriesDto} from "./series.dto";


export interface SeriesWithWriterDto {
    series: SeriesDto;
    writer: UserProfileDto;
}
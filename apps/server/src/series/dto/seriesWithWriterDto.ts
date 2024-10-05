import {SeriesDto} from "./series.dto";
import {WriterUserProfileDto} from "../../writerInfo/dto";


export interface SeriesWithWriterDto {
    series: SeriesDto;
    writer: WriterUserProfileDto;
}
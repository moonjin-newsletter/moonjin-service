import {PostWithContentDto} from "./postWithContent.dto";
import {WriterDto} from "../../writerInfo/dto";
import {SeriesDto} from "../../series/dto";


export interface PostWithContentAndSeriesAndWriterDto extends PostWithContentDto, WriterDto{
    series : SeriesDto | null
}
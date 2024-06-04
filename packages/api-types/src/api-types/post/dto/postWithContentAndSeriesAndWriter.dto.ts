import {PostWithContentDto} from "./postWithContent.dto";
import {WriterDto} from "../../writer/dto";
import {SeriesDto} from "../../series/dto";


export interface PostWithContentAndSeriesAndWriterDto extends PostWithContentDto, WriterDto{
    series : SeriesDto | null
}
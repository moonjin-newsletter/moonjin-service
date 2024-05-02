import {PostWithContentDto} from "./postWithContent.dto";
import {SeriesDto} from "../../series/dto";


export interface PostWithContentAndSeriesDto extends PostWithContentDto{
    series : SeriesDto
}
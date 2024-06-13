import {PostDto} from "./post.dto";
import {SeriesDto} from "../../series/dto";

export interface PostWithSeriesDto {
    post : PostDto,
    series : SeriesDto | null
}
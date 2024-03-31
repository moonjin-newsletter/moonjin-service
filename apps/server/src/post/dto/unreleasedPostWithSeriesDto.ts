import {PostDto} from "./post.dto";
import {SeriesDto} from "../../series/dto";

export interface UnreleasedPostWithSeriesDto {
    post : PostDto,
    series : SeriesDto | null
}
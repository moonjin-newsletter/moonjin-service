import {tags} from "typia";

export interface IGetPostBySeriesId {
    seriesId?: number & tags.Minimum<0>;
}
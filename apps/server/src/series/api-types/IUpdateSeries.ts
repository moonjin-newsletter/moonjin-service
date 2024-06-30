import { tags } from "typia";

export interface IUpdateSeries {
    title: string & tags.MaxLength<32>;
    category : string;
    description : string & tags.MaxLength<256>;
    cover? : string & tags.MaxLength<128>;
}
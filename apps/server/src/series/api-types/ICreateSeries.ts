import { tags } from "typia";

export interface ICreateSeries {
    title: string & tags.MaxLength<32>;
    category : string & tags.MaxLength<16>;
    status : boolean;
    cover? : string & tags.MaxLength<128>;
    description? : string & tags.MaxLength<256>;
}
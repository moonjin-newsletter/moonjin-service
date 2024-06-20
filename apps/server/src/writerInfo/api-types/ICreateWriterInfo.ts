import {tags} from "typia";

export interface ICreateWriterInfo{
    moonjinId: string & tags.MaxLength<32>;
    nickname: string & tags.MaxLength<16>;
    description: string & tags.MaxLength<256>;
}
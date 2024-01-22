import {tags} from "typia";

export interface ICreatePost {
    title: string & tags.MaxLength<32>;
    content: string & tags.MaxLength<2048>;
    category: string & tags.MaxLength<16>;
    cover?: string & tags.MaxLength<128>;
    seriesId? : number;
    status?: boolean;
    releasedAt?: Date;
}
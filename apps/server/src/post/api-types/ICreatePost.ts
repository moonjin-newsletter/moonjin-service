import {tags} from "typia";
import {EditorJsonDto} from "@moonjin/editorjs";

export interface ICreatePost {
    title: string & tags.MaxLength<32>;
    content: EditorJsonDto;
    category?: string;
    subtitle?: string & tags.MaxLength<128>;
    cover?: string & tags.MaxLength<128>;
    seriesId? : number & tags.Minimum<0>;
}
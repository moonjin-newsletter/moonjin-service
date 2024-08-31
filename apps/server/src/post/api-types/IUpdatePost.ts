import {tags} from "typia";
import {EditorJsonDto} from "@moonjin/editorjs-types";

export interface IUpdatePost {
    title: string & tags.MaxLength<32>;
    content: EditorJsonDto;
    category?: string;
    subtitle?: string & tags.MaxLength<128>;
    cover: string & tags.MaxLength<128> | null;
    seriesId? : number & tags.Minimum<0>;
}
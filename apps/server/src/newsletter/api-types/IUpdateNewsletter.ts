import {tags} from "typia";
import {EditorJsonDto} from "@moonjin/editorjs";

export interface IUpdateNewsletter {
    title: string & tags.MaxLength<32>;
    content: EditorJsonDto;
}
import {tags} from "typia";
import {EditorJsonDto} from "@moonjin/editorjs-types";

export interface IUpdateNewsletter {
    title: string & tags.MaxLength<32>;
    subtitle: string & tags.MaxLength<256>;
    content: EditorJsonDto;
}
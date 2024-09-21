import {EditorJsonDto} from "@moonjin/editorjs-types";

export interface IUpdateNewsletter {
    title: string;
    subtitle: string;
    content: EditorJsonDto;
}
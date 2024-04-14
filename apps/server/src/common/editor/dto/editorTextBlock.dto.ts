import {EditorBlockDto} from "./editorBlock.dto";

export interface EditorTextBlockDto extends EditorBlockDto{
    id : "string";
    type : "header" | "paragraph" | "quote";
    data: {
        text: string;
    }
}
import {EditorBaseBlock} from "./editorBase.block";

export interface TextBlock extends EditorBaseBlock{
    id : string;
    type : "header" | "paragraph" | "quote";
    data: {
        text: string;
    }
}
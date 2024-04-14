import {EditorBlockDto} from "./editorBlock.dto";

export interface EditorJsonDto{
    time: number;
    blocks: EditorBlockDto[];
    version?: string;
}
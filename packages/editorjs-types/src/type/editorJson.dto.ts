import {EditorBlockDto} from "./block/editorBlock.dto";

export type EditorJsonDto = {
    time: number;
    blocks: EditorBlockDto[];
    version?: string;
}
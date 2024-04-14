import {EditorBlockDto} from "./editorBlock.dto";
import {JsonObject} from "@prisma/client/runtime/library";

export interface EditorJsonDto extends JsonObject{
    time: number;
    blocks: EditorBlockDto[];
    version?: string;
}
import {JsonArray} from "@prisma/client/runtime/library";

export interface EditorBlockDto extends JsonArray{
    id : string;
    type: string;
    data: object;
    tunes? : object;
}
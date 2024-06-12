import {EditorBaseBlock} from "../base/editorBase.block";

export interface ListBlockItem {
    content : string,
    items : ListBlockItem[]
}

export interface ListBlock extends EditorBaseBlock {
    type : "list";
    data: {
        type: "ordered" | "unordered";
        items: ListBlockItem[];
    }
}
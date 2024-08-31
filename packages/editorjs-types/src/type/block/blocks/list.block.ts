import {EditorBaseBlock} from "../base/editorBase.block";

export interface ListBlockItem {
    content : string,
    items : ListBlockItem[]
}

export interface ListBlock extends EditorBaseBlock {
    type : "list";
    data: {
        style: "ordered" | "unordered";
        items: ListBlockItem[];
    }
}
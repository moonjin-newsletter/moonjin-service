import {EditorBaseBlock} from "../base/editorBase.block";

export interface CheckListBox{
    text : string,
    checked : boolean
}
export interface CheckListBlock extends EditorBaseBlock {
    type : "checklist",
    data : {
        items : CheckListBox[]
    }
}
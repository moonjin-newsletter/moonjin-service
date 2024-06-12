import {EditorBaseBlock} from "../base/editorBase.block";


export interface EmbedBlock extends EditorBaseBlock {
    type : "embed",
    data : {
        service : string,
        source : string,
        embed : string,
        width : number,
        height : number,
        caption : string
    }
}
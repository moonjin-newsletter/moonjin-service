import {EditorBaseBlock} from "../base/editorBase.block";

export interface LinkEmbedBlock extends EditorBaseBlock{
    type : "linkTool",
    data : {
        link : string,
        meta : {
            title? : string,
            site_name? : string,
            description? : string,
            image? : {
                url : string,
            }
        }
    }
}
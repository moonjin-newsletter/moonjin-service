import {EditorBaseBlock} from "../base/editorBase.block";

export interface ImageBlock extends EditorBaseBlock {
    type: "image",
    data: {
        file: {
            url: string,
        },
        withBorder: boolean,
        withBackground: boolean,
        stretched: boolean,
        caption: string,
    }
}
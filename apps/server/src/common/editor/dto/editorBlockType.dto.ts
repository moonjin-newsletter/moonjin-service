import {EditorBlockDto, } from "./editorBlock.dto";
import {EditorTextBlockDto} from "./editorTextBlock.dto";

export interface ParagraphBlockDto extends EditorTextBlockDto {
    type : "paragraph";
    data: {
        text: string;
    }
}

export interface HeaderBlockDto extends EditorTextBlockDto {
    type : "header";
    data: {
        text: string;
        level: number;
    }
}

export interface ListBlockDto extends EditorBlockDto {
    type : "list";
    data: {
        type: "ordered" | "unordered";
        items: string[];
    }
}

export interface ImageBlockDto extends EditorBlockDto {
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


export interface CheckListBoxDto{
    text : string,
    checked : boolean
}
export interface CheckListBlockDto extends EditorBlockDto {
    type : "checklist",
    data : {
        items : CheckListBoxDto[]
    }
}

export interface EmbedBlockDto extends EditorBlockDto {
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

export interface LinkEmbedBlockDto extends EditorBlockDto{
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

export interface QuoteBlockDto extends EditorTextBlockDto{
    type : "quote",
    data : {
        text : string,
        caption : string,
        alignment : "left" | "center"
    }
}

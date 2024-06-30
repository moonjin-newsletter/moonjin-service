import {EditorJsonDto} from "@moonjin/editorjs";

export interface ICreatePost {
    title: string
    content: EditorJsonDto;
    category?: string;
    subtitle?: string
    cover?: string
    seriesId? : number
}
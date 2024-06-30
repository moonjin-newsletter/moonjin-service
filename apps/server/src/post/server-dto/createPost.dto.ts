import {EditorJsonDto} from "@moonjin/editorjs";

export interface CreatePostDto {
    title: string;
    content: EditorJsonDto;
    category?: string;
    cover?: string;
    seriesId? : number;
}
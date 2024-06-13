import {EditorJsonDto} from "@moonjin/editorjs";

export interface CreatePostDto {
    title: string;
    content: EditorJsonDto;
    category?: string;
    status?: boolean;
    cover?: string;
    seriesId? : number;
}
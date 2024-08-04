import {EditorJsonDto} from "@moonjin/editorjs";

export interface CreatePostDto {
    title: string;
    content: EditorJsonDto;
    category: number;
    cover: string | null;
    seriesId? : number;
}
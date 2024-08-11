import {EditorJsonDto} from "@moonjin/editorjs";

export interface UpdatePostDto {
    title: string;
    content: EditorJsonDto;
    category: number;
    cover: string | null;
    seriesId? : number;
}
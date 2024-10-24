import {EditorJsonDto} from "@moonjin/editorjs-types";


export interface UpdatePostDto {
    title: string;
    content: EditorJsonDto;
    category: number;
    cover: string | null;
    subtitle: string;
    seriesId? : number;
}
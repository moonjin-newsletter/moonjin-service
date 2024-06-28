import {EditorJsonDto} from "@moonjin/editorjs";
import {CategoryEnum} from "../../common/category.enum";

export interface CreatePostDto {
    title: string;
    content: EditorJsonDto;
    category?: CategoryEnum;
    cover?: string;
    seriesId? : number;
}
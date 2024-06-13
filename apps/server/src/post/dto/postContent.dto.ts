import {EditorJsonDto} from "@moonjin/editorjs";

export interface PostContentDto {
    id : number;
    postId: number;
    content: EditorJsonDto,
    createdAt: Date;
}
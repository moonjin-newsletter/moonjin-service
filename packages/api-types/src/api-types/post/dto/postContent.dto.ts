import {EditorJsonDto} from "@moonjin/editorjs-types";

export interface PostContentDto {
    id : number;
    postId: number;
    content: EditorJsonDto,
    createdAt: Date;
}
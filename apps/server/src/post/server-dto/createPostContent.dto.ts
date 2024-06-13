import {EditorJsonDto} from "@moonjin/editorjs";

export interface CreatePostContentDto {
    postId: number;
    content: EditorJsonDto;
}
import {EditorJsonDto} from "@moonjin/editorjs-types";


export interface CreatePostContentDto {
    postId: number;
    content: EditorJsonDto;
}
import {EditorJsonDto} from "../../common/editor/dto";

export interface CreatePostContentDto {
    postId: number;
    content: EditorJsonDto;
}
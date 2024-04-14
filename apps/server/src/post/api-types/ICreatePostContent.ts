import {tags} from "typia";
import {EditorJsonDto} from "../../common/editor/dto";

export interface ICreatePostContent{
    postId: number & tags.Minimum<1>;
    content: EditorJsonDto;
}
import {tags} from "typia";
import {EditorJsonDto} from "@moonjin/editorjs";

export interface ICreatePostContent{
    postId: number & tags.Minimum<1>;
    content: EditorJsonDto;
}
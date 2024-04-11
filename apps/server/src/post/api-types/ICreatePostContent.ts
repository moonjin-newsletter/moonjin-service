import {tags} from "typia";

export interface ICreatePostContent{
    postId: number & tags.Minimum<1>;
    content: object;
}
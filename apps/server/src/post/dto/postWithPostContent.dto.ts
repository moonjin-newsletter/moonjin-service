import {PostDto} from "./post.dto";
import {PostContentDto} from "./postContent.dto";

export interface PostWithPostContentDto {
    post : PostDto;
    postContent: PostContentDto;
}
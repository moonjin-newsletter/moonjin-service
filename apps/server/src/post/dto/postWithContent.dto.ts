import {PostDto} from "./post.dto";
import {PostContentDto} from "./postContent.dto";

export interface PostWithContentDto {
    post : PostDto;
    postContent: PostContentDto;
}
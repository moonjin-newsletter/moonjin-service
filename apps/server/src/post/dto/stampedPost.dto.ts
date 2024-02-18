import {PostDto} from "./post.dto";

export interface StampedPostDto {
    post : PostDto,
    stamp : {
        createdAt : Date
    }
}
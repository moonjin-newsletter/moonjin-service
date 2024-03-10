import {ReleasedPostDto} from "./releasedPost.dto";

export interface StampedPostDto {
    post : ReleasedPostDto,
    stamp : {
        createdAt : Date
    }
}
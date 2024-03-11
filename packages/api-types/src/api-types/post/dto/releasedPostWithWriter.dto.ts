import { UserProfileDto} from "../../user/dto";
import {ReleasedPostDto} from "./releasedPost.dto";

export interface ReleasedPostWithWriterDto {
    post : ReleasedPostDto,
    writer: UserProfileDto
}
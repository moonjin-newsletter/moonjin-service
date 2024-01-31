import {UserIdentityDto} from "../../user/dto/userIdentity.dto";
import {PostDto} from "./post.dto";

export interface PostWithWriterUserDto {
    post : PostDto,
    writer: UserIdentityDto
}
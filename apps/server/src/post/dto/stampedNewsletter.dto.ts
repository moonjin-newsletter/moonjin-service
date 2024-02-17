import {UserIdentityDto} from "../../user/dto/userIdentity.dto";
import {PostDto} from "./post.dto";

export interface StampedNewsletterDto {
    post : PostDto,
    writer: UserIdentityDto,
    stamp : {createdAt : Date}
}
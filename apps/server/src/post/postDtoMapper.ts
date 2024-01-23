import {Post} from "@prisma/client";
import {PostDto} from "./dto/post.dto";


class PostDtoMapperClass {
    PostToPostDto(post: Post):PostDto {
        const {deleted, createdAt, ...postData} = post;
        return postData;
    }
}
const PostDtoMapper = new PostDtoMapperClass();
export default PostDtoMapper;
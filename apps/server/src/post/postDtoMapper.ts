import {Post} from "@prisma/client";
import {PostDto} from "./dto/post.dto";


class PostDtoMapperClass {
    PostToPostDto(post: Post):PostDto {
        const {deleted, createdAt, status , ...postData} = post;
        return postData;
    }

    PostListToPostDtoList(postList: Post[]):PostDto[] {
        return postList.map(post => this.PostToPostDto(post));
    }
}
const PostDtoMapper = new PostDtoMapperClass();
export default PostDtoMapper;
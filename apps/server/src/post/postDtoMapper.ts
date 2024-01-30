import {PostDto} from "./dto/post.dto";
import {Post} from "@prisma/client";


class PostDtoMapperClass {
    PostToPostDto(post: Post):PostDto {
        const {deleted, createdAt ,...postData} = post;
        return postData;
    }

    PostListToPostDtoList(postList: Post[]):PostDto[] {
        return postList.map(post => this.PostToPostDto(post));
    }
}
const PostDtoMapper = new PostDtoMapperClass();
export default PostDtoMapper;
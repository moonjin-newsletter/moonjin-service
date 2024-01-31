import {PostDto} from "./dto/post.dto";
import {Post} from "@prisma/client";
import {UserIdentityDto} from "../user/dto/userIdentity.dto";
import {PostWithWriterUserDto} from "./dto/postWithWriterUser.dto";


class PostDtoMapperClass {
    PostToPostDto(post: Post):PostDto {
        const {deleted, createdAt , status,...postData} = post;
        return postData;
    }

    PostListToPostDtoList(postList: Post[]):PostDto[] {
        return postList.map(post => this.PostToPostDto(post));
    }


    PostAndWriterUserDtoToPostWithWriterUserDto(post : Post, writerUser : UserIdentityDto): PostWithWriterUserDto {
        const postData = this.PostToPostDto(post);
        return {post : postData, writer : writerUser}
    }

    PostAndWriterUserDtoListToPostWithWriterUserDtoList(postList : Post[], writerUserList : UserIdentityDto[]): PostWithWriterUserDto[] {
        const postWithWriterUserList : PostWithWriterUserDto[] = []
        postList.forEach(post => {
            const followingUser = writerUserList.find(writer => writer.id === post.writerId);
            if(followingUser){
                postWithWriterUserList.push(this.PostAndWriterUserDtoToPostWithWriterUserDto(post,followingUser))
            }
        })
        return postWithWriterUserList;
    }
}
const PostDtoMapper = new PostDtoMapperClass();
export default PostDtoMapper;
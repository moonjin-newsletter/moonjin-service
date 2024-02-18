import {PostDto} from "./dto/post.dto";
import {Post} from "@prisma/client";
import {UserIdentityDto} from "../user/dto/userIdentity.dto";
import {PostWithWriterUserDto} from "./dto/postWithWriterUser.dto";
import {StampedPostDto} from "./dto/stampedPost.dto";
import {StampedPost} from "./dto/stampedPostWithWriter.prisma.type";


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

    StampedPostToStampedPostDto(stampedPostWithWriter : StampedPost): StampedPostDto{
        const {post, ...stamp} = stampedPostWithWriter;
        return {
            post : this.PostToPostDto(post),
            stamp : {
                createdAt: stamp.createdAt
            }
        }
    }

}
const PostDtoMapper = new PostDtoMapperClass();
export default PostDtoMapper;
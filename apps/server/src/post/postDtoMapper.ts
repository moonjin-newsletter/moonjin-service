import {NewsletterDto, PostDto} from "./dto";
import {Post} from "@prisma/client";
import {ReleasedPostWithWriterDto, StampedPostDto} from "./dto";
import {StampedPost} from "./prisma/stampedPostWithWriter.prisma.type";
import {ReleasedPostDto, UnreleasedPostDto} from "./dto";
import {NewsletterWithPostAndSeriesAndWriterUser} from "./prisma/newsletterWithPost.prisma.type";
import UserDtoMapper from "../user/userDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";


class PostDtoMapperClass {
    PostToPostDto(post: Post):PostDto {
        const {deleted, createdAt , status, releasedAt,...postData} = post;
        return postData;
    }
    PostToReleasedPostDto(post: Post, releasedDate : Date) : ReleasedPostDto {
        const postData = this.PostToPostDto(post);
        return {...postData, releasedAt : post.releasedAt ?? releasedDate}
    }
    PostToUnreleasedPostDto(post: Post):UnreleasedPostDto {
        return this.PostToPostDto(post);
    }
    PostListToPostDtoList(postList: Post[]):PostDto[] {
        return postList.map(post => this.PostToPostDto(post));
    }
    PostListToReleasedPostDtoList(postList: Post[]):ReleasedPostDto[] {
        const releasedPostList : ReleasedPostDto[] = [];
        postList.forEach(post => {
            if(post.releasedAt){
                releasedPostList.push(PostDtoMapper.PostToReleasedPostDto(post, post.releasedAt));
            }
        })
        return releasedPostList;
    }
    NewsletterWithPostAndSeriesAndWriterUserToNewsletterDto(newsletter : NewsletterWithPostAndSeriesAndWriterUser): NewsletterDto {
        const {  sentAt, post } = newsletter;
        const {writerInfo, series,...postData } = post;
        return {
            post : this.PostToReleasedPostDto(postData, sentAt), // TODO : sentAt이 releasedAt으로 바뀌어야 함
            series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
            writer : UserDtoMapper.UserToUserProfileDto(writerInfo.user),
        }
    }


    NewsletterWithPostAndWriterUserToReleasedPostWithWriterDto(newsletter : NewsletterWithPostAndSeriesAndWriterUser): ReleasedPostWithWriterDto {
        const {  sentAt, post } = newsletter;
        const {writerInfo, ...postData } = post;
        return {
            post : this.PostToReleasedPostDto(postData, sentAt), // TODO : sentAt이 releasedAt으로 바뀌어야 함
            writer : UserDtoMapper.UserToUserProfileDto(writerInfo.user),
        }

    }

    StampedPostListToStampedPostDtoList(stampedPostList : StampedPost[]): StampedPostDto[] {
        const stampedPostDtoList : StampedPostDto[] = [];
        stampedPostList.forEach(stampedPost => {
            if(stampedPost.post.releasedAt){
                stampedPostDtoList.push(this.StampedPostToStampedPostDto(stampedPost, stampedPost.post.releasedAt));
            }
        })
        return stampedPostDtoList;
    }

    StampedPostToStampedPostDto(stampedPostWithWriter : StampedPost, releasedDate : Date): StampedPostDto{
        const {post, ...stamp} = stampedPostWithWriter;
        return {
            post : this.PostToReleasedPostDto(post, releasedDate),
            stamp : {
                createdAt: stamp.createdAt
            }
        }
    }

}
const PostDtoMapper = new PostDtoMapperClass();
export default PostDtoMapper;
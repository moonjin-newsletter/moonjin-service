import {NewsletterDto, PostDto} from "./dto";
import {Post, PostContent} from "@prisma/client";
import {ReleasedPostWithWriterDto, StampedPostDto} from "./dto";
import {StampedPost} from "./prisma/stampedPostWithWriter.prisma.type";
import {ReleasedPostDto, UnreleasedPostWithSeriesDto} from "./dto";
import {NewsletterWithPostAndSeriesAndWriterUser} from "./prisma/newsletterWithPost.prisma.type";
import UserDtoMapper from "../user/userDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import {PostWithSeriesAndWriterUser} from "./prisma/postWithSeriesAndWriterUser.prisma.type";
import {PostWithSeries} from "./prisma/postWithSeries.prisma.type";
import {PostContentDto} from "./dto/postContent.dto";


class PostDtoMapperClass {
    PostToPostDto(post: Post):PostDto {
        const {deleted, createdAt , status, releasedAt,...postData} = post;
        return postData;
    }
    PostToReleasedPostDto(post: Post, releasedDate : Date) : ReleasedPostDto {
        const postData = this.PostToPostDto(post);
        return {...postData, releasedAt : post.releasedAt ?? releasedDate}
    }
    PostWithSeriesToUnreleasedPostDto(post: PostWithSeries):UnreleasedPostWithSeriesDto {
        return {
            post: this.PostToPostDto(post),
            series: post.series ? SeriesDtoMapper.SeriesToSeriesDto(post.series) : null
        }
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

    PostWithSeriesAndWriterUserListToNewsLetterDtoList(postList: PostWithSeriesAndWriterUser[]):NewsletterDto[] {
        const newsLetterList : NewsletterDto[] = [];
        postList.forEach(post => {
            const {  series, writerInfo, ...postData} = post;
            if(postData.releasedAt){
                newsLetterList.push({
                    post: this.PostToReleasedPostDto(postData, postData.releasedAt),
                    series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                    writer : UserDtoMapper.UserToUserProfileDto(writerInfo.user),
                });
            }
        })
        return newsLetterList;
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

    PostContentToPostContentDto(postContent: PostContent): PostContentDto {
        return {
            postId: postContent.postId,
            content: postContent.content,
            createdAt: postContent.createdAt
        }
    }

}
const PostDtoMapper = new PostDtoMapperClass();
export default PostDtoMapper;
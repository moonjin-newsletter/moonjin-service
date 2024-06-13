import {Post, PostContent} from "@prisma/client";
import { PostDto, PostContentDto,ReleasedPostDto, PostWithSeriesDto} from "./dto";
import UserDtoMapper from "../user/userDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import {PostWithSeriesAndWriterUser} from "./prisma/postWithSeriesAndWriterUser.prisma.type";
import {PostWithSeries} from "./prisma/postWithSeries.prisma.type";
import {NewsletterDto} from "../newsletter/dto";
import {ObjectToEditorJsonDto} from "@moonjin/editorjs";


class PostDtoMapper {
    public static PostToPostDto(post: Post):PostDto {
        const {deleted, createdAt , status,...postData} = post;
        return postData;
    }
    public static PostToReleasedPostDto(post: Post) : ReleasedPostDto {
        return this.PostToPostDto(post);
    }
    public static PostWithSeriesToUnreleasedPostDto(post: PostWithSeries):PostWithSeriesDto {
        return {
            post: this.PostToPostDto(post),
            series: post.series ? SeriesDtoMapper.SeriesToSeriesDto(post.series) : null
        }
    }

    public static PostListToPostDtoList(postList: Post[]):PostDto[] {
        return postList.map(post => this.PostToPostDto(post));
    }
    public static PostListToReleasedPostDtoList(postList: Post[]):ReleasedPostDto[] {
        return postList.map(post => this.PostToReleasedPostDto(post));
    }

    public static PostWithSeriesAndWriterUserListToNewsLetterDtoList(postList: PostWithSeriesAndWriterUser[]):NewsletterDto[] {
        const newsLetterList : NewsletterDto[] = [];
        postList.forEach(post => {
            const {  series, writerInfo, ...postData} = post;
            newsLetterList.push({
                post: this.PostToReleasedPostDto(postData),
                series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer : UserDtoMapper.UserToUserProfileDto(writerInfo.user),
            });
        })
        return newsLetterList;
    }

    public static PostContentToPostContentDto(postContent: PostContent): PostContentDto {
        return {
            id : postContent.id,
            postId: postContent.postId,
            content: ObjectToEditorJsonDto(JSON.parse(postContent.content)),
            createdAt: postContent.createdAt
        }
    }

}
export default PostDtoMapper;
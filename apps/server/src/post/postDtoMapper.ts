import {Post, PostContent} from "@prisma/client";
import {PostDto, PostContentDto, ReleasedPostDto, PostWithSeriesDto, PostInNewsletterCardDto} from "./dto";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import {PostWithSeries} from "./prisma/postWithSeries.prisma.type";
import {ObjectToEditorJsonDto} from "@moonjin/editorjs";
import {Category} from "@moonjin/api-types";


class PostDtoMapper {
    public static PostToPostDto(post: Post):PostDto {
        const {deleted ,category,...postData} = post;
        return {
            ...postData,
            category: Category.getCategoryByNumber(category),
        };
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

    public static PostContentToPostContentDto(postContent: PostContent): PostContentDto {
        return {
            id : postContent.id,
            postId: postContent.postId,
            content: ObjectToEditorJsonDto(JSON.parse(postContent.content)),
            createdAt: postContent.createdAt
        }
    }

    public static PostToPostInNewsletterCardDto(post: Post): PostInNewsletterCardDto {
        const {deleted ,...postData} = post;
        return {
            id: postData.id,
            title: postData.title,
            preview: postData.preview
        }
    }
}
export default PostDtoMapper;
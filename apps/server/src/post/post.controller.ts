import {Controller, UseGuards} from '@nestjs/common';
import {TypedBody, TypedParam, TypedQuery, TypedRoute} from "@nestia/core";
import {ICreatePost} from "./api-types/ICreatePost";
import {PostService} from "./post.service";
import {
    UnreleasedPostWithSeriesDto,
    PostWithContentDto,
    PostWithContentAndSeriesDto
} from "./dto";
import {createResponseForm} from "../response/responseForm";
import { TryCatch} from "../response/tryCatch";
import {
    CREATE_POST_ERROR,
    FORBIDDEN_FOR_POST,
    POST_CONTENT_NOT_FOUND,
    POST_NOT_FOUND,
} from "../response/error/post";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {SeriesService} from "../series/series.service";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {USER_NOT_WRITER} from "../response/error/auth";
import {IGetPostBySeriesId} from "./api-types/IGetPostBySeriesId";
import {UserService} from "../user/user.service";
import {editorJsToHtml, generateNextPaginationUrl} from "../common";
import {FORBIDDEN_FOR_SERIES, SERIES_NOT_FOUND} from "../response/error/series";
import {NewsletterListWithPaginationDto} from "./dto";
import {GetPagination} from "../common/pagination/decorator/GetPagination.decorator";
import {PaginationOptionsDto} from "../common/pagination/dto";
import {ICreatePostContent} from "./api-types/ICreatePostContent";
import {PostContentDto} from "./dto";
import {ExceptionList} from "../response/error/errorInstances";
import {NewsletterDto} from "../newsletter/dto";


@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly seriesService: SeriesService,
        private readonly userService:UserService,
    ) {}

    /**
     * @summary 게시글 생성 API
     * @param postData
     * @param user
     * @return PostDto
     * @throws CREATE_POST_ERROR
     * @throws SERIES_NOT_FOUND
     */
    @TypedRoute.Post()
    @UseGuards(WriterAuthGuard)
    async createPost(@TypedBody() postData : ICreatePost, @User() user:UserAuthDto): Promise<TryCatch<
        PostWithContentDto, SERIES_NOT_FOUND | CREATE_POST_ERROR>>
    {
        if(postData.seriesId) {
            const series = await this.seriesService.assertSeriesExist(postData.seriesId);
            postData.category = series.category;
        }
        const post = await this.postService.createPost(postData,user.id);
        return createResponseForm(post)
    }

    /**
     * @summary 해당 글의 내용 업데이트
     * @param postId
     * @param postUpdateData
     * @param user
     * @returns PostContentDto
     * @throws POST_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     * @throws CREATE_POST_ERROR
     * @throws SERIES_NOT_FOUND
     */
    @TypedRoute.Patch(':id')
    @UseGuards(WriterAuthGuard)
    async updatePost(@TypedParam('id') postId : number, @TypedBody() postUpdateData : ICreatePost, @User() user:UserAuthDto) : Promise<
        TryCatch<PostWithContentDto, POST_NOT_FOUND | FORBIDDEN_FOR_POST | SERIES_NOT_FOUND | CREATE_POST_ERROR>>
    {
        await this.postService.assertWriterOfPost(postId,user.id);
        if(postUpdateData.seriesId) {
            const series = await this.seriesService.assertSeriesExist(postUpdateData.seriesId);
            postUpdateData.category = series.category;
        }
        return createResponseForm(await this.postService.updatePost(postId,postUpdateData))
    }

    /**
     * @summary 내가 발표한 글 목록 가져오기
     * @param user
     * @returns ReleasedPostDto[]
     * @throws USER_NOT_WRITER
     */
    @TypedRoute.Get('me')
    @UseGuards(WriterAuthGuard)
    async getMyReleasedPostList(@User() user:UserAuthDto) : Promise<TryCatch<NewsletterDto[], USER_NOT_WRITER>>{
        const postList = await this.postService.getReleasedPostListByUserId(user.id);
        return createResponseForm(postList);
    }

    /**
     * @summary 해당 유저의 작성 중인 글 목록 가져오기
     * @param user
     * @returns UnreleasedPostWithSeriesDto[]
     * @throws USER_NOT_WRITER
     */
    @TypedRoute.Get('/writing')
    @UseGuards(WriterAuthGuard)
    async getWritingPostList(@User() user:UserAuthDto) : Promise<TryCatch<UnreleasedPostWithSeriesDto[], USER_NOT_WRITER>>{
        const postList = await this.postService.getWritingPostList(user.id);
        return createResponseForm(postList);
    }

    /**
     * @summary 해당 유저의 글 삭제
     * @param user
     * @param postId
     * @throws POST_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     */
    @TypedRoute.Delete(':id')
    @UseGuards(WriterAuthGuard)
    async deletePost(@User() user:UserAuthDto, @TypedParam('id') postId : number) : Promise<
        TryCatch<{ message:string },
        POST_NOT_FOUND | FORBIDDEN_FOR_POST>>
    {
        await this.postService.deletePost(postId,user.id);
        await this.userService.synchronizeNewsLetter(user.id, false);
        return createResponseForm({
            message : "해당 글을 삭제했습니다."
        })
    }

    /**
     * @summary 해당 시리즈의 글 목록 가져오기
     * @param user
     * @param series
     * @returns NewsletterDto[]
     * @throws SERIES_NOT_FOUND
     * @throws FORBIDDEN_FOR_SERIES
     */
    @TypedRoute.Get()
    @UseGuards(UserAuthGuard)
    async getPostListInSeries(@User() user:UserAuthDto, @TypedQuery() series : IGetPostBySeriesId) : Promise<TryCatch<
        NewsletterDto[], SERIES_NOT_FOUND | FORBIDDEN_FOR_SERIES>>{
        if(series.seriesId)
            await this.seriesService.assertUserCanAccessToSeries(series.seriesId, user.id);
        const postList = await this.postService.getReleasedPostListBySeriesId(series.seriesId);
        return createResponseForm(postList);
    }

    /**
     * @summary 모든 글 목록 가져오기
     * @param user
     * @param paginationOption
     * @param series
     * @returns NewsletterDto[]
     * @throws SERIES_NOT_FOUND
     * @throws FORBIDDEN_FOR_SERIES
     */
    @TypedRoute.Get('page')
    @UseGuards(UserAuthGuard)
    async getAllReleasedPosts(@User() user:UserAuthDto, @GetPagination() paginationOption : PaginationOptionsDto, @TypedQuery() series : IGetPostBySeriesId) : Promise<TryCatch<
        NewsletterListWithPaginationDto ,SERIES_NOT_FOUND | FORBIDDEN_FOR_SERIES>>{
        if(series.seriesId) {
            await this.seriesService.assertUserCanAccessToSeries(series.seriesId, user.id);
        }
        const postList = await this.postService.getReleasedPostListBySeriesId(series.seriesId, paginationOption);
        const nextUrl = postList.length > 0 ? generateNextPaginationUrl(paginationOption.take, postList[postList.length - 1].post.id) : "";
        return createResponseForm({
            newsletters : postList,
            paginationMetaData :{
                nextUrl,
                isLastPage : postList.length < paginationOption.take,
                totalCount : postList.length
            }
        });
    }

    /**
     * @summary 해당 글의 내용 업데이트
     * @param postData
     * @param user
     * @returns PostContentDto
     * @throws POST_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     * @throws CREATE_POST_ERROR
     */
    @TypedRoute.Patch("content")
    @UseGuards(WriterAuthGuard)
    async updatePostContent(@TypedBody() postData : ICreatePostContent, @User() user:UserAuthDto) : Promise<
        TryCatch<PostContentDto, POST_NOT_FOUND | FORBIDDEN_FOR_POST | CREATE_POST_ERROR>>
    {
        await this.postService.assertWriterOfPost(postData.postId,user.id);
        const postContent = await this.postService.uploadPostContent(postData);
        return createResponseForm(postContent)
    }

    /**
     * @summary 해당 글의 내용 가져오기
     * @param postId
     * @returns PostWithContentDto | PostWithContentAndSeriesDto
     * @throws POST_CONTENT_NOT_FOUND
     * @throws POST_NOT_FOUND
     */
    @TypedRoute.Get(":id")
    @UseGuards(UserAuthGuard)
    async getPostWithContentAndSeries(@TypedParam('id') postId : number): Promise<TryCatch<PostWithContentDto | PostWithContentAndSeriesDto,
        POST_CONTENT_NOT_FOUND | POST_NOT_FOUND>>
    {
        const postContent = await this.postService.getPostWithContentAndSeries(postId);
        return createResponseForm(postContent)
    }

    /**
     * @summary 해당 글의 metadata 가져오기
     * @param postId
     * @returns PostMetaDataDto | UnreleasedPostWithSeriesDto
     * @throws POST_CONTENT_NOT_FOUND
     * @throws POST_NOT_FOUND
     */
    @TypedRoute.Get(":id/metadata")
    @UseGuards(UserAuthGuard)
    async getPostMetadata(@TypedParam('id') postId : number): Promise<TryCatch<UnreleasedPostWithSeriesDto,
        POST_CONTENT_NOT_FOUND | POST_NOT_FOUND>>
    {
        const postContent = await this.postService.getPostById(postId);
        if(postContent.seriesId > 0){
            const series = await this.seriesService.getReleasedSeriesById(postContent.seriesId);
            return createResponseForm({
                post : postContent,
                series
            })
        }
        return createResponseForm({
            post :postContent,
            series : null
        })
    }

    @TypedRoute.Get(':id/html')
    @UseGuards(UserAuthGuard)
    async getPostHtml(@TypedParam('id') postId : number): Promise<TryCatch<string, POST_CONTENT_NOT_FOUND | POST_NOT_FOUND>>
    {
        const postContent = await this.postService.getPostWithContentAndSeries(postId);
        try{
            return createResponseForm(editorJsToHtml(postContent.postContent));
        }catch (error){
            throw ExceptionList.FORBIDDEN_FOR_POST;
        }
    }

}

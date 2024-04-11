import {Controller, UseGuards} from '@nestjs/common';
import {TypedBody, TypedParam, TypedQuery, TypedRoute} from "@nestia/core";
import {ICreatePost} from "./api-types/ICreatePost";
import {PostService} from "./post.service";
import {StampedPostDto, UnreleasedPostWithSeriesDto, NewsletterDto, PostDto} from "./dto";
import {createResponseForm} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {CREATE_POST_ERROR, FORBIDDEN_FOR_POST, POST_NOT_FOUND, STAMP_ALREADY_EXIST} from "../response/error/post";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {SeriesService} from "../series/series.service";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {USER_NOT_WRITER} from "../response/error/auth";
import {FOLLOWER_NOT_FOUND} from "../response/error/user";
import {IGetPostBySeriesId} from "./api-types/IGetPostBySeriesId";
import {IGetNewsletter} from "./api-types/IGetNewsletter";
import {UserService} from "../user/user.service";
import {generateNextPaginationUrl} from "../common";
import {FORBIDDEN_FOR_SERIES, SERIES_NOT_FOUND} from "../response/error/series";
import {NewsletterListWithPaginationDto} from "./dto";
import {GetPagination} from "../common/pagination/decorator/GetPagination.decorator";
import {PaginationOptionsDto} from "../common/pagination/dto";


@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly seriesService: SeriesService,
        private readonly userService:UserService
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
        PostDto, CREATE_POST_ERROR>>
    {
        if(postData.seriesId) await this.seriesService.assertSeriesExist(postData.seriesId);
        const post = await this.postService.createPost({writerId:user.id,...postData});
        return createResponseForm(post)
    }

    /**
     * @summary 해당 글을 뉴스레터로 발송
     * @param user
     * @param postId
     * @returns {sentCount: number}
     * @throws POST_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     * @throws FOLLOWER_NOT_FOUND
     */
    @TypedRoute.Post(':id/newsletter')
    @UseGuards(WriterAuthGuard)
    async sendNewsletter(@User() user:UserAuthDto, @TypedParam('id') postId : number)
    : Promise<TryCatch<{sentCount: number}, POST_NOT_FOUND | FORBIDDEN_FOR_POST | FOLLOWER_NOT_FOUND>>{
        await this.postService.assertWriterOfPost(postId,user.id);
        const sentCount = await this.postService.sendNewsletter(postId);
        await this.userService.synchronizeNewsLetter(user.id, true);
        return createResponseForm({
            sentCount : sentCount
        })
    }

    /**
     * @summary 해당 유저의 뉴스레터 목록 가져오기
     * @param user
     * @param seriesOption
     * @returns NewsletterDto[]
     */
    @TypedRoute.Get('newsletter')
    @UseGuards(UserAuthGuard)
    async getNewsletter(@User() user:UserAuthDto, @TypedQuery() seriesOption : IGetNewsletter) : Promise<Try<NewsletterDto[]>>{
        const newsletterList = await this.postService.getNewsletterListByUserId(user.id, seriesOption.seriesOnly?? false);
        return createResponseForm(newsletterList);
    }

    /**
     * @summary 해당 유저의 스탬프 이력 가져오기
     * @param user
     * @returns StampedPostDto[]
     */
    @TypedRoute.Get('stamp')
    @UseGuards(UserAuthGuard)
    async getStampedNewsletter(@User() user:UserAuthDto): Promise<Try<StampedPostDto[]>>{
        const stampedPostList = await this.postService.getStampedPostListByUserId(user.id);
        return createResponseForm(stampedPostList);
    }

    /**
     * @summary stamp 기능
     * @param user
     * @param postId
     * @throws STAMP_ALREADY_EXIST
     */
    @TypedRoute.Post(':postId/stamp')
    @UseGuards(UserAuthGuard)
    async stampPost(@User() user:UserAuthDto, @TypedParam('postId') postId : number) : Promise<TryCatch<{
        message: string,
        createdAt: Date
    }, STAMP_ALREADY_EXIST>>{
        const stamp = await this.postService.stampPost( postId, user.id);
        return createResponseForm({
            message : "스탬프를 찍었습니다.",
            createdAt : stamp.createdAt
        });
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
}

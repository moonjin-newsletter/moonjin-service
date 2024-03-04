import {Controller, UseGuards} from '@nestjs/common';
import {TypedBody, TypedParam, TypedRoute} from "@nestia/core";
import {ICreatePost} from "./api-types/ICreatePost";
import {PostService} from "./post.service";
import {PostDto} from "./dto/post.dto";
import {createResponseForm} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {CREATE_POST_ERROR, NOT_ACCESSED_FOR_POST, POST_NOT_FOUND, STAMP_ALREADY_EXIST} from "../response/error/post";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto/userAuthDto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {SeriesService} from "../series/series.service";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {PostWithWriterUserDto} from "./dto/postWithWriterUser.dto";
import {StampedPostDto} from "./dto/stampedPost.dto";
import {USER_NOT_WRITER} from "../response/error/auth";


@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly seriesService: SeriesService
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
        PostDto,
        CREATE_POST_ERROR>>
    {
        if(postData.seriesId) await this.seriesService.assertSeriesExist(postData.seriesId);
        const post = await this.postService.createPost({writerId:user.id,...postData});
        return createResponseForm(post)
    }

    /**
     * @summary 모든 게시글 가져오기
     * @return PostDto[] | []
     */
    @TypedRoute.Get()
    async getPost() {
        const postList = await this.postService.getPublicPostAll();
        if(postList === null) return createResponseForm([]);
        return createResponseForm(postList);
    }


    /**
     * @summary 해당 글을 뉴스레터로 전송
     * @param user
     * @param postId
     */
    @TypedRoute.Post(':id/newsletter')
    @UseGuards(WriterAuthGuard)
    async sendNewsletter(@User() user:UserAuthDto, @TypedParam('id') postId : number){
        await this.postService.assertWriterOfPost(postId,user.id);
        const sentCount = await this.postService.sendNewsletter(postId);
        return createResponseForm({
            sentCount : sentCount
        })
    }

    /**
     * @summary 해당 유저의 뉴스레터 목록 가져오기
     * @param user
     * @returns PostWithWriterUserDto[]
     */
    @TypedRoute.Get('newsletter')
    @UseGuards(UserAuthGuard)
    async getNewsletter(@User() user:UserAuthDto) : Promise<Try<PostWithWriterUserDto[]>>{
        const newsletterList = await this.postService.getNewsletterListByUserId(user.id);
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
        date: Date
    }, STAMP_ALREADY_EXIST>>{
        const stamp = await this.postService.stampPost( postId, user.id);
        return createResponseForm({
            message : "스탬프를 찍었습니다.",
            date : stamp.createdAt
        });
    }

    /**
     * @summary 해당 유저의 작성 중인 글 목록 가져오기
     * @param user
     * @returns PostDto[]
     * @throws USER_NOT_WRITER
     */
    @TypedRoute.Get('/writing')
    @UseGuards(WriterAuthGuard)
    async getWritingPostList(@User() user:UserAuthDto) : Promise<TryCatch<PostDto[], USER_NOT_WRITER>>{
        const postList = await this.postService.getWritingPost(user.id);
        return createResponseForm(postList);
    }

    /**
     * @summary 해당 유저의 글 삭제s
     * @param user
     * @param postId
     * @throws POST_NOT_FOUND
     * @throws NOT_ACCESSED_FOR_POST
     */
    @TypedRoute.Delete(':id')
    @UseGuards(WriterAuthGuard)
    async deletePost(@User() user:UserAuthDto, @TypedParam('id') postId : number) : Promise<TryCatch<{ message:string }, POST_NOT_FOUND | NOT_ACCESSED_FOR_POST>> {
        await this.postService.deletePost(postId,user.id);
        return createResponseForm({
            message : "해당 글을 삭제했습니다."
        })
    }
}

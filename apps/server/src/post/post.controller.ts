import {Controller, UseGuards} from '@nestjs/common';
import {TypedBody, TypedParam, TypedRoute} from "@nestia/core";
import {ICreatePost} from "./api-types/ICreatePost";
import {PostService} from "./post.service";
import {PostDto} from "./dto/post.dto";
import {createResponseForm} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {CREATE_POST_ERROR} from "../response/error/post";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto/userAuthDto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {SeriesService} from "../series/series.service";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {PostWithWriterUserDto} from "./dto/postWithWriterUser.dto";


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
        await this.postService.assertWriter(postId,user.id);
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
     * @returns PostWithWriterUserDto[]
     */
    @TypedRoute.Get('stamp')
    @UseGuards(UserAuthGuard)
    async getStampedNewsletter(@User() user:UserAuthDto){
        await this.postService.getStampedNewsletterListByUserId();
        return user.id // TODO
    }

    /**
     * @summary stamp 기능
     * @param user
     * @param postId
     */
    @TypedRoute.Post(':postId/stamp')
    @UseGuards(UserAuthGuard)
    async stampPost(@User() user:UserAuthDto, @TypedParam('postId') postId : number){
        const stamp = await this.postService.stampPost(user.id, postId);
        return createResponseForm(stamp);
    }

}

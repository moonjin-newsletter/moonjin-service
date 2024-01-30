import {Controller, UseGuards} from '@nestjs/common';
import {TypedBody, TypedParam, TypedRoute} from "@nestia/core";
import {ICreatePost} from "./api-types/ICreatePost";
import {PostService} from "./post.service";
import {PostDto} from "./dto/post.dto";
import {createResponseForm} from "../response/responseForm";
import {TryCatch} from "../response/tryCatch";
import {CREATE_POST_ERROR} from "../response/error/post";
import {User} from "../auth/decorator/user.decorator";
import {UserDto} from "../auth/dto/user.dto";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {SeriesService} from "../series/series.service";


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
    async createPost(@TypedBody() postData : ICreatePost, @User() user:UserDto): Promise<TryCatch<
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
    async sendNewsletter(@User() user:UserDto, @TypedParam('id') postId : number){
        await this.postService.assertWriter(postId,user.id);
        const sentCount = await this.postService.sendNewsletter(postId);
        return createResponseForm({
            sentCount : sentCount
        })
    }

}

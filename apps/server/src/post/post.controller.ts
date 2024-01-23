import {Controller, UseGuards} from '@nestjs/common';
import {TypedBody, TypedRoute} from "@nestia/core";
import {ICreatePost} from "./api-types/ICreatePost";
import {PostService} from "./post.service";
import {PostDto} from "./dto/post.dto";
import {createResponseForm} from "../response/responseForm";
import {TryCatch} from "../response/tryCatch";
import {CREATE_POST_ERROR} from "../response/error/post/post.error";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserDto} from "../auth/dto/user.dto";


@Controller('post')
export class PostController {
    constructor(
        private readonly postService: PostService,
    ) {}

    /**
     * @summary 게시글 생성 API
     * @param postData
     * @param user
     * @return PostDto
     * @throws CREATE_POST_ERROR
     */
    @TypedRoute.Post()
    @UseGuards(UserAuthGuard)
    async createPost(@TypedBody() postData : ICreatePost, @User() user:UserDto): Promise<TryCatch<
        PostDto,
        CREATE_POST_ERROR>>
    {
        console.log(user)
        const post = await this.postService.createPost({writerId:user.id,...postData});
        return createResponseForm(post)
    }






}

import { Controller } from '@nestjs/common';
import {TypedBody, TypedRoute} from "@nestia/core";
import {ICreatePost} from "./api-types/ICreatePost";


@Controller('post')
export class PostController {

    @TypedRoute.Post()
    async createPost(@TypedBody() postData : ICreatePost) {
        return postData;
    }
}

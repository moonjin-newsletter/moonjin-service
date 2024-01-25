import { Injectable } from '@nestjs/common';
import {CreatePostDto} from "./dto/createPost.dto";
import {PrismaService} from "../prisma/prisma.service";
import PostDtoMapper from "./postDtoMapper";
import {Post} from "@prisma/client";
import {ExceptionList} from "../response/error/errorInstances";
import {PostDto} from "./dto/post.dto";
import {UtilService} from "../util/util.service";

@Injectable()
export class PostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
    ) {}

    /**
     * @summary 게시글 생성
     * @param postData
     * @return Promise<PostDto>
     * @throws CREATE_POST_ERROR
     */
    async createPost(postData : CreatePostDto) : Promise<PostDto> {
        try {
            const releaseDate = postData.releasedAt ? postData.releasedAt : this.utilService.getCurrentDateInKorea()
            const post: Post = await this.prismaService.post.create({
                data : {
                    ...postData,
                    createdAt : this.utilService.getCurrentDateInKorea(),
                    releasedAt : (postData.status) ? releaseDate : null
                }
            })
            return PostDtoMapper.PostToPostDto(post);
        }catch (error){
            console.error(error);
            throw ExceptionList.CREATE_POST_ERROR;
        }
    }

    /**
     * @summary 모든 게시글 가져오기
     * @return Promise<PostDto[] | null>
     */
    async getPostAll(): Promise<PostDto[] | null> {
        const post = await this.prismaService.post.findMany(
            {
                where: {
                    deleted: false,
                    status : true
                },
            }
        );
        if(!post) return null;
        return PostDtoMapper.PostListToPostDtoList(post);
    }
}

import { Injectable } from '@nestjs/common';
import {CreatePostDto} from "./dto/createPost.dto";
import {PrismaService} from "../prisma/prisma.service";
import PostDtoMapper from "./postDtoMapper";
import {Follow, Post, Prisma} from "@prisma/client";
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

    /**
     * @summary 해당 글의 작성자인지 확인
     * @param postId
     * @param writerId
     * @throws POST_NOT_FOUND
     * @throws NOT_ACCESSED_FOR_POST
     */
    async assertWriter(postId : number, writerId : number) : Promise<void> {
        const post = await this.prismaService.post.findUnique({
            where : {
                id : postId
            }
        })
        if(!post) throw ExceptionList.POST_NOT_FOUND;
        if(post.writerId !== writerId) throw ExceptionList.NOT_ACCESSED_FOR_POST;
    }

    /**
     * @summary 해당 글을 나를 구독 중인 사람들에게 뉴스레터로 전송
     * @param postId
     * @return 전송된 뉴스레터 수
     * @throws POST_NOT_FOUND
     */
    async sendNewsletter(postId : number) : Promise<number> {

        const post = await this.prismaService.post.findUnique({
            where : {
                id : postId,
                deleted : false,
            }
        })
        if(!post) throw ExceptionList.POST_NOT_FOUND;

        const followers : Follow[] = await this.prismaService.follow.findMany({
            where :{
                writerId : post.writerId
            }
        })
        if(followers.length === 0) throw ExceptionList.FOLLOWER_NOT_FOUND;

        try {
            const now = this.utilService.getCurrentDateInKorea();
            const newsletterData : Prisma.NewsletterCreateInput[] = followers.map(follower => {
                return {
                    postId,
                    receiverId : follower.followerId,
                    sentAt : now,
                }
            });
            const sentNewsletter = await this.prismaService.newsletter.createMany({
                data : newsletterData,
                skipDuplicates : true
            })
            return sentNewsletter.count;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

import {Injectable} from '@nestjs/common';
import {CreatePostDto} from "./dto/createPost.dto";
import {PrismaService} from "../prisma/prisma.service";
import PostDtoMapper from "./postDtoMapper";
import {Follow, Post, Stamp} from "@prisma/client";
import {ExceptionList} from "../response/error/errorInstances";
import {PostDto} from "./dto/post.dto";
import {UtilService} from "../util/util.service";
import {UserService} from "../user/user.service";
import {PostWithWriterUserDto} from "./dto/postWithWriterUser.dto";
import {StampedPost} from "./dto/stampedPostWithWriter.prisma.type";
import {StampedPostDto} from "./dto/stampedPost.dto";
import {AuthValidationService} from "../auth/auth.validation.service";

@Injectable()
export class PostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly userService: UserService,
        private readonly authValidationService: AuthValidationService
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
     * @summary 공개되어 있는 모든 게시글 가져오기
     * @return Promise<PostDto[] | null>
     */
    async getPublicPostAll(): Promise<PostDto[] | null> {
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
    async assertWriterOfPost(postId : number, writerId : number) : Promise<void> {
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
     * @throws FOLLOWER_NOT_FOUND
     */
    async sendNewsletter(postId : number) : Promise<number> {

        const post = await this.prismaService.post.findUnique({
            where : {
                id : postId,
                deleted : false,
            }
        })
        if(!post) throw ExceptionList.POST_NOT_FOUND;

        const followers : Follow[] = await this.prismaService.follow.findMany({ // TODO : follower 가 deleted 아닌 지 join해서 확인하는 로직 추가
            where :{
                writerId : post.writerId
            }
        })
        if(followers.length === 0) throw ExceptionList.FOLLOWER_NOT_FOUND;

        try {
            const now = this.utilService.getCurrentDateInKorea();
            const newsletterData = followers.map(follower => {
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

    /**
     * @summary 해당 유저의 뉴스레터 가져오기
     * @param userId
     * @return PostWithWriterUserDto[]
     */
    async getNewsletterListByUserId(userId : number) : Promise<PostWithWriterUserDto[]>{
        const newsletterList = await this.prismaService.newsletter.findMany({
            where : {
                receiverId : userId
            },
            select : {
                postId : true,
            },
            orderBy : {
                sentAt : 'desc'
            }
        })
        const postIdList = newsletterList.map(newsletter => newsletter.postId);
        const postList = await this.prismaService.post.findMany({
            where : {
                id : {
                    in : postIdList
                },
            },
            orderBy : {
                releasedAt : 'desc'
            }
        })

        try{
            const writerIdList = [...new Set(postList.map(post => post.writerId))];
            const writerUserDtoList = await this.userService.getUserIdentityDataListByWriterIdList(writerIdList);
            return PostDtoMapper.PostAndWriterUserDtoListToPostWithWriterUserDtoList(postList,writerUserDtoList);
        }catch (error){
            console.error(error);
            return [];
        }
    }

    /**
     * @summary post를 stamp 찍기
     * @param userId
     * @param postId
     * @throws STAMP_ALREADY_EXIST
     */
    async stampPost(postId: number, userId : number) : Promise<Stamp>{
        const createdAt = this.utilService.getCurrentDateInKorea();
        try{
            return await this.prismaService.stamp.create({
                data: {
                    userId,
                    postId,
                    createdAt
                }
            });
        } catch (error) {
            throw ExceptionList.STAMP_ALREADY_EXIST; // TODO: Stamp를 찍었던 날짜를 돌려주는 게 맞을지 고민해보기
        }
    }

    /**
     * @summary 해당 유저의 스탬프 이력 가져오기
     * @param userId
     * @return StampedPostDto[]
     */
    async getStampedPostListByUserId(userId : number): Promise<StampedPostDto[]> {
        const stampedPostList : StampedPost[] = await this.prismaService.stamp.findMany({
            where : {
                userId
            },
            include: {
                post : true
            },
            relationLoadStrategy: 'join',
            orderBy : {
                createdAt : 'desc'
            }
        })
        if(stampedPostList.length === 0) return [];
        return stampedPostList.map(stampedPost => PostDtoMapper.StampedPostToStampedPostDto(stampedPost));
    }

    /**
     * @summary 해당 유저가 작성중인 글 목록 가져오기
     * @param userId
     * @return PostDto[]
     * @throws USER_NOT_WRITER
     */
    async getWritingPostList(userId: number): Promise<PostDto[]> {
        await this.authValidationService.assertWriter(userId);
        try{
            const postList = await this.prismaService.post.findMany({
                where : {
                    writerId : userId,
                    releasedAt : null,
                    deleted : false
                },
                orderBy : {
                    createdAt : 'desc'
                }
            })
            return PostDtoMapper.PostListToPostDtoList(postList);
        }catch (error){
            console.error(error);
            return [];
        }
    }

    /**
     * @summary 글 삭제
     * @param postId
     * @param userId
     * @throws POST_NOT_FOUND
     * @throws NOT_ACCESSED_FOR_POST
     */
    async deletePost(postId: number, userId: number): Promise<void> {
        await this.assertWriterOfPost(postId, userId);
        try{
            await this.prismaService.post.update({
                where : {
                    id : postId
                },
                data : {
                    deleted : true,
                }
            }) // TODO : 글 삭제 시 Side Effect 생길 시 고려하기
        }catch (error){
            console.error(error);
        }
    }

    /**
     * @summary 해당 유저의 발표된 글 목록 가져오기
     * @param userId
     * @return PostDto[]
     * @throws USER_NOT_WRITER
     */
    async getReleasedPostListByUserId(userId : number): Promise<PostDto[]>{
        await this.authValidationService.assertWriter(userId);
        try{
            const postList = await this.prismaService.post.findMany({
                where : {
                    writerId : userId,
                    releasedAt : {
                        not : null
                    },
                    status : true,
                    deleted : false
                },
                orderBy : {
                    releasedAt : 'desc'
                }
            })
            return PostDtoMapper.PostListToPostDtoList(postList);
        } catch (error){
            console.error(error);
            return [];
        }

    }
}

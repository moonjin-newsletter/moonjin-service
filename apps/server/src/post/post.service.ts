import {Injectable} from '@nestjs/common';
import {CreatePostDto, NewsletterDto, StampedPostDto} from "./dto";
import {PrismaService} from "../prisma/prisma.service";
import PostDtoMapper from "./postDtoMapper";
import {Follow, Post, Stamp} from "@prisma/client";
import {ExceptionList} from "../response/error/errorInstances";
import {UtilService} from "../util/util.service";
import {StampedPost} from "./prisma/stampedPostWithWriter.prisma.type";
import {AuthValidationService} from "../auth/auth.validation.service";
import {ReleasedPostDto, UnreleasedPostDto} from "./dto";
import {NewsletterWithPostAndSeriesAndWriterUser} from "./prisma/newsletterWithPost.prisma.type";
import {PostWithSeriesAndWriterUser} from "./prisma/postWithSeriesAndWriterUser.prisma.type";

@Injectable()
export class PostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly authValidationService: AuthValidationService
    ) {}

    /**
     * @summary 게시글 생성
     * @param postData
     * @return UnreleasedPostDto
     * @throws CREATE_POST_ERROR
     */
    async createPost(postData : CreatePostDto) : Promise<UnreleasedPostDto> {
        try {
            const post: Post = await this.prismaService.post.create({
                data : {
                    ...postData,
                    createdAt : this.utilService.getCurrentDateInKorea(),
                }
            })
            return PostDtoMapper.PostToUnreleasedPostDto(post);
        }catch (error){
            console.error(error);
            throw ExceptionList.CREATE_POST_ERROR;
        }
    }

    /**
     * @summary 공개되어 있는 모든 게시글 가져오기
     * @return ReleasedPostDto[]
     */
    async getPublicPostAll(): Promise<ReleasedPostDto[]> {
        const postList = await this.prismaService.post.findMany(
            {
                where: {
                    deleted: false,
                    status : true,
                    releasedAt : {
                        not : null
                    }
                },
            }
        );
        return PostDtoMapper.PostListToReleasedPostDtoList(postList);
    }

    /**
     * @summary 해당 글의 작성자인지 확인
     * @param postId
     * @param writerId
     * @throws POST_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     */
    async assertWriterOfPost(postId : number, writerId : number) : Promise<void> {
        const post = await this.prismaService.post.findUnique({
            where : {
                id : postId
            }
        })
        if(!post) throw ExceptionList.POST_NOT_FOUND;
        if(post.writerId !== writerId) throw ExceptionList.FORBIDDEN_FOR_POST;
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
     * @param seriesOnly
     * @return NewsletterDto[]
     */
    async getNewsletterListByUserId(userId : number, seriesOnly = false) : Promise<NewsletterDto[]>{
        const newsletterList : NewsletterWithPostAndSeriesAndWriterUser[] = await this.prismaService.newsletter.findMany({
            where : {
                receiverId : userId,
                post : {
                    seriesId : seriesOnly ? {
                        gt : 0
                    } : undefined
                },
            },
            select : {
                sentAt : true,
                post : {
                    include : {
                        writerInfo : {
                            include : {
                                user : true
                            }
                        },
                        series : true
                    },
                },
            },
            relationLoadStrategy: 'join',
            orderBy : {
                sentAt : 'desc'
            }
        })
        return newsletterList.map(newsletter => PostDtoMapper.NewsletterWithPostAndSeriesAndWriterUserToNewsletterDto(newsletter));
    }

    /**
     * @summary post를 stamp 찍기
     * @param userId
     * @param postId
     * @return Stamp
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
        return PostDtoMapper.StampedPostListToStampedPostDtoList(stampedPostList);
    }

    /**
     * @summary 해당 유저가 작성중인 글 목록 가져오기
     * @param userId
     * @return UnreleasedPostDto[]
     * @throws USER_NOT_WRITER
     */
    async getWritingPostList(userId: number): Promise<UnreleasedPostDto[]> {
        await this.authValidationService.assertWriter(userId);
        try{
            const postList = await this.prismaService.post.findMany({
                where : {
                    writerId : userId,
                    releasedAt : null,
                    deleted : false
                },
                relationLoadStrategy: 'join',
                orderBy : {
                    createdAt : 'desc'
                }
            })
            return postList.map(post => PostDtoMapper.PostToUnreleasedPostDto(post));
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
     * @param status (true)
     * @return ReleasedPostDto[]
     * @throws USER_NOT_WRITER
     */
    async getReleasedPostListByUserId(userId : number, status= true): Promise<NewsletterDto[]>{
        await this.authValidationService.assertWriter(userId);
        try{
            const postList : PostWithSeriesAndWriterUser[] = await this.prismaService.post.findMany({
                where : {
                    writerId : userId,
                    releasedAt : {
                        not : null
                    },
                    status,
                    deleted : false
                },
                include:{
                    series : true,
                    writerInfo : {
                        include : {
                            user : true
                        }
                    }
                },
                relationLoadStrategy: 'join',
                orderBy : {
                    releasedAt : 'desc'
                }
            })
            return PostDtoMapper.PostWithSeriesAndWriterUserListToNewsLetterDtoList(postList);
        } catch (error){
            console.error(error);
            return [];
        }
    }

    /**
     * @summary 해당 시리즈의 발표된 글 목록 가져오기
     * @param seriesId
     * @return ReleasedPostDto[]
     */
    async getReleasedPostListBySeriesId(seriesId : number): Promise<ReleasedPostDto[]> {
        const postList = await this.prismaService.post.findMany({
            where : {
                seriesId,
                releasedAt : {
                    not : null
                },
                status : true,
                deleted : false
            },
            relationLoadStrategy: 'join',
            orderBy : {
                releasedAt : 'desc'
            }
        })
        return PostDtoMapper.PostListToReleasedPostDtoList(postList);
    }
}

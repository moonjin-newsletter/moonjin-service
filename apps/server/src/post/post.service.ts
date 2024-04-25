import {Injectable} from '@nestjs/common';
import {
    NewsletterDto,
    PostWithPostContentDto,
    ReleasedPostDto,
    StampedPostDto,
    UnreleasedPostWithSeriesDto
} from "./dto";
import {PrismaService} from "../prisma/prisma.service";
import PostDtoMapper from "./postDtoMapper";
import {Stamp} from "@prisma/client";
import {ExceptionList} from "../response/error/errorInstances";
import {UtilService} from "../util/util.service";
import {StampedPost} from "./prisma/stampedPostWithWriter.prisma.type";
import {AuthValidationService} from "../auth/auth.validation.service";
import {NewsletterWithPostAndSeriesAndWriterUser} from "./prisma/newsletterWithPost.prisma.type";
import {PostWithSeriesAndWriterUser} from "./prisma/postWithSeriesAndWriterUser.prisma.type";
import {PostWithSeries} from "./prisma/postWithSeries.prisma.type";
import {PaginationOptionsDto} from "../common/pagination/dto";
import {convertEditorJsonToPostPreview, editorJsToHtml} from "../common";
import {CreatePostContentDto} from "./server-dto/createPostContent.dto";
import {PostContentDto} from "./dto/postContent.dto";
import {CreatePostDto} from "./server-dto/createPost.dto";
import {PostWithContents} from "./prisma/postWithContents.prisma.type";
import {UserService} from "../user/user.service";
import {MailService} from "../mail/mail.service";

@Injectable()
export class PostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly authValidationService: AuthValidationService,
        private readonly userService:UserService,
        private readonly mailService : MailService
    ) {}

    /**
     * @summary 게시글 생성
     * @param createPostData
     * @param writerId
     * @return PostWithPostContentDto
     * @throws CREATE_POST_ERROR
     */
    async createPost(createPostData : CreatePostDto, writerId: number) : Promise<PostWithPostContentDto> {
        const cover = this.utilService.processImageForCover(createPostData.cover);
        const {content,...postMetaData} = createPostData
        try {
            const post = await this.prismaService.post.create({
                data: {
                    ...postMetaData,
                    preview: convertEditorJsonToPostPreview(content),
                    writerId,
                    cover,
                    createdAt: this.utilService.getCurrentDateInKorea(),
                    postContent: {
                        create: {
                            content: JSON.stringify(content),
                            createdAt: this.utilService.getCurrentDateInKorea()
                        }
                    }
                },
                include:{
                    postContent: true
                },
            })
            const {postContent,...postData} = post;
            return {
                post: PostDtoMapper.PostToPostDto(postData),
                postContent: PostDtoMapper.PostContentToPostContentDto(postContent[0]) // TODO: 위험하려나
            }
        }catch (error){
            console.error(error);
            throw ExceptionList.CREATE_POST_ERROR;
        }
    }

    /**
     * @summary 게시글 수정
     * @param postId
     * @param updatePostData
     * @return PostWithPostContentDto
     * @throws CREATE_POST_ERROR
     */
    async updatePost(postId: number, updatePostData: CreatePostDto): Promise<PostWithPostContentDto> {
        const cover = this.utilService.processImageForCover(updatePostData.cover);
        const {content,...postMetaData} = updatePostData
        try {
            const post = await this.prismaService.post.update({
                where :{
                    id : postId
                },
                data: {
                    ...postMetaData,
                    preview: convertEditorJsonToPostPreview(content),
                    cover,
                    lastUpdatedAt: this.utilService.getCurrentDateInKorea(),
                    postContent: {
                        create: {
                            content: JSON.stringify(content),
                            createdAt: this.utilService.getCurrentDateInKorea()
                        }
                    }
                },
                include:{
                    postContent: true
                },
            })
            const {postContent,...postData} = post;
            return {
                post: PostDtoMapper.PostToPostDto(postData),
                postContent: PostDtoMapper.PostContentToPostContentDto(postContent[0]) // TODO: 위험하려나
            }
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
     * @throws POST_CONTENT_NOT_FOUND
     * @throws FOLLOWER_NOT_FOUND
     */
    async sendNewsletter(postId : number) : Promise<number> {
        const postWithContent = await this.getPostWithContentByPostId(postId);
        const followers =await this.userService.getAllFollowerByWriterId(postWithContent.post.writerId);
        if(followers.followerList.length == 0 && followers.externalFollowerList.length == 0) throw ExceptionList.FOLLOWER_NOT_FOUND;

        const sentCount = await this.sendWebNewsletter(postId, followers.followerList.map(follower => follower.user.id));
        const emailList = followers.externalFollowerList.map(follower => follower.email);
        const writer = await this.userService.getWriterInfoByUserId(postWithContent.post.writerId);

        followers.followerList.map(follower => {
            emailList.push(follower.user.email)
        });

        const sendNewsLetterDto = {
            emailList,
            senderName: writer.user.nickname,
            senderMailAddress: writer.writerInfo.moonjinId + '@' + process.env.MAILGUN_DOMAIN,
            subject: postWithContent.post.title,
            html: editorJsToHtml(postWithContent.postContent),
        }
        await this.mailService.sendNewsLetterWithHtml(sendNewsLetterDto);
        return sentCount;
    }

    /**
     * 해당 유저들에게 Web 뉴스레터 전송하기
     * @param postId
     * @param receiverIdList
     * @return 전송된 뉴스레터 수
     * @throws SEND_NEWSLETTER_ERROR
     */
    async sendWebNewsletter(postId: number, receiverIdList: number[]): Promise<number>{
        try {
            const now = this.utilService.getCurrentDateInKorea();
            const newsletterData = receiverIdList.map(receiverId => {
                return {
                    postId,
                    receiverId,
                    sentAt : now,
                }
            });
            const sentNewsletter = await this.prismaService.newsletter.createMany({
                data : newsletterData,
                skipDuplicates : true
            })
            console.log(sentNewsletter);
            return sentNewsletter.count;
        } catch (error) {
            console.error(error);
            throw ExceptionList.SEND_NEWSLETTER_ERROR;
        }
    }

    /**
     * @summary 해당 Post와 글 내용 반환
     * @param postId
     * @return PostWithPostContentDto
     * @throws POST_NOT_FOUND
     * @throws POST_CONTENT_NOT_FOUND
     */
    async getPostWithContentByPostId(postId: number): Promise<PostWithPostContentDto>{
        const postWithContents: PostWithContents | null = await this.prismaService.post.findUnique({
            where : {
                id : postId,
                deleted : false,
            },
            include:{
                postContent:{
                    orderBy:{
                        createdAt : 'desc'
                    }
                }
            },
            relationLoadStrategy: 'join'
        })
        if(!postWithContents) throw ExceptionList.POST_NOT_FOUND;
        if(postWithContents && postWithContents.postContent.length === 0) throw ExceptionList.POST_CONTENT_NOT_FOUND;
        return {
            post: PostDtoMapper.PostToPostDto(postWithContents),
            postContent: PostDtoMapper.PostContentToPostContentDto(postWithContents.postContent[0])
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
     * @return UnreleasedPostWithSeriesDto[]
     * @throws USER_NOT_WRITER
     */
    async getWritingPostList(userId: number): Promise<UnreleasedPostWithSeriesDto[]> {
        await this.authValidationService.assertWriter(userId);
        try{
            const postList: PostWithSeries[] = await this.prismaService.post.findMany({
                where : {
                    writerId : userId,
                    releasedAt : null,
                    deleted : false
                },
                include: {
                    series : true
                },
                relationLoadStrategy: 'join',
                orderBy : {
                    createdAt : 'desc'
                }
            })
            return postList.map(post => PostDtoMapper.PostWithSeriesToUnreleasedPostDto(post));
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
     * @param paginationOptions
     * @return ReleasedPostDto[]
     */
    async getReleasedPostListBySeriesId(seriesId? : number, paginationOptions? : PaginationOptionsDto): Promise<NewsletterDto[]> {
        const postList : PostWithSeriesAndWriterUser[] = await this.prismaService.post.findMany({
            where : {
                seriesId : seriesId?? undefined,
                releasedAt : {
                    not : null
                },
                status : true,
                deleted : false
            },
            include: {
                writerInfo : {
                    include : {
                        user : true
                    }
                },
                series : true
            },
            relationLoadStrategy: 'join',
            orderBy : {
                releasedAt : 'desc'
            },
            skip: paginationOptions?.skip,
            take: paginationOptions?.take,
            cursor: paginationOptions?.cursor ? {
                id : paginationOptions.cursor
            } : undefined
        })

        return PostDtoMapper.PostWithSeriesAndWriterUserListToNewsLetterDtoList(postList);
    }

    /**
     * @summary 해당 글의 내용 업로드
     * @param postContentData
     * @return PostContentDto
     * @throws CREATE_POST_ERROR
     */
    async uploadPostContent(postContentData : CreatePostContentDto): Promise<PostContentDto>{
        try{
            const postContent = await this.prismaService.postContent.create({
                data: {
                    postId : postContentData.postId,
                    content : JSON.stringify(postContentData.content),
                    createdAt : this.utilService.getCurrentDateInKorea(),
                },
            });
            await this.updatePostPreview(postContentData.postId,convertEditorJsonToPostPreview(postContentData.content));
            return PostDtoMapper.PostContentToPostContentDto(postContent);
        }catch (error){
            console.log(error);
            throw ExceptionList.CREATE_POST_ERROR;
        }
    }

    /**
     * @summary 해당 글의 내용 가져오기
     * @param postId
     * @return PostContentDto
     * @throws POST_CONTENT_NOT_FOUND
     * @throws POST_NOT_FOUND
     */
    async getPostContentWithPostData(postId : number): Promise<PostWithPostContentDto>{
        const postContent = await this.prismaService.postContent.findFirst({
            where : {
                postId
            },
            include:{
                post : true
            },
            relationLoadStrategy: 'join',
            orderBy : {
                createdAt : 'desc'
            }
        })
        if(!postContent) throw ExceptionList.POST_CONTENT_NOT_FOUND;
        if(!postContent.post) throw ExceptionList.POST_NOT_FOUND;
        return {
            post: PostDtoMapper.PostToPostDto(postContent.post),
            postContent: PostDtoMapper.PostContentToPostContentDto(postContent)
        }
    }

    /**
     * @summary 해당 글의 preview 업데이트
     * @param postId
     * @param preview
     * @throws POST_NOT_FOUND
     */
    async updatePostPreview(postId: number, preview: string): Promise<void>{
        try{
            await this.prismaService.post.update({
                where : {
                    id : postId
                },
                data : {
                    preview
                }
            })
        }catch (error){
            console.error(error);
            throw ExceptionList.POST_NOT_FOUND;
        }
    }
}

import {Injectable} from '@nestjs/common';
import {PostDto, PostWithContentAndSeriesDto,
    PostWithContentDto,
    ReleasedPostDto,
    PostWithSeriesDto,
    PostContentDto,
    PostWithContentAndSeriesAndWriterDto
} from "./dto";
import {PrismaService} from "../prisma/prisma.service";
import PostDtoMapper from "./postDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import {UtilService} from "../util/util.service";
import {AuthValidationService} from "../auth/auth.validation.service";
import {PostWithSeriesAndWriterUser} from "./prisma/postWithSeriesAndWriterUser.prisma.type";
import {PaginationOptionsDto} from "../common/pagination/dto";
import {CreatePostContentDto} from "./server-dto/createPostContent.dto";
import {CreatePostDto} from "./server-dto/createPost.dto";
import {PostWithContents} from "./prisma/postWithContents.prisma.type";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import {PostWithContentAndSeries} from "./prisma/postWithContentAndSeries.prisma";
import {NewsletterDto} from "../newsletter/dto";
import UserDtoMapper from "../user/userDtoMapper";
import {EditorJsToPostPreview} from "@moonjin/editorjs";
import {PostWithSeriesAndNewsletter} from "./prisma/postWithSeriesAndNewsletter.prisma.type";

@Injectable()
export class PostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly authValidationService: AuthValidationService,
    ) {}

    /**
     * @summary 게시글 생성
     * @param createPostData
     * @param writerId
     * @return PostWithContentDto
     * @throws CREATE_POST_ERROR
     */
    async createPost(createPostData : CreatePostDto, writerId: number) : Promise<PostWithContentDto> {
        const cover = this.utilService.processImageForCover(createPostData.cover);
        const {content,...postMetaData} = createPostData
        try {
            const post = await this.prismaService.post.create({
                data: {
                    ...postMetaData,
                    preview: EditorJsToPostPreview(content.blocks),
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
     * @return PostWithContentDto
     * @throws CREATE_POST_ERROR
     */
    async updatePost(postId: number, updatePostData: CreatePostDto): Promise<PostWithContentDto> {
        const cover = (updatePostData.cover) ? {cover : updatePostData.cover} : {};
        const {content,...postMetaData} = updatePostData
        try {
            const post = await this.prismaService.post.update({
                where :{
                    id : postId
                },
                data: {
                    ...postMetaData,
                    preview: EditorJsToPostPreview(content.blocks),
                    ...cover,
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
     * @summary 해당 Post와 글 내용 반환
     * @param postId
     * @return PostWithContentDto
     * @throws POST_NOT_FOUND
     * @throws POST_CONTENT_NOT_FOUND
     */
    async getPostWithContentByPostId(postId: number): Promise<PostWithContentDto>{
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
     * @summary 해당 유저가 작성중인 글 목록 가져오기
     * @param userId
     * @return PostWithSeriesDto[]
     * @throws USER_NOT_WRITER
     */
    async getWritingPostList(userId: number): Promise<PostWithSeriesDto[]> {
        await this.authValidationService.assertWriter(userId);
        try{
            const postList: PostWithSeriesAndNewsletter[] = await this.prismaService.post.findMany({
                where : {
                    writerId : userId,
                    deleted : false,
                },
                include: {
                    series : true,
                    newsletter: {
                        orderBy : {
                            sentAt : 'desc'
                        }
                    }
                },
                relationLoadStrategy: 'join',
                orderBy : {
                    createdAt : 'desc',
                }
            })
            return postList.filter(post => post.newsletter.length == 0 || post.lastUpdatedAt > post.newsletter[post.newsletter.length-1].sentAt)
                .map(post => {
                    const {newsletter,series, ...postData} = post;
                    return {
                        post: PostDtoMapper.PostToPostDto(postData),
                        series: series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null
                    }
                });

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
                    status : false,
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
            await this.updatePostPreview(postContentData.postId,EditorJsToPostPreview(postContentData.content.blocks));
            return PostDtoMapper.PostContentToPostContentDto(postContent);
        }catch (error){
            console.log(error);
            throw ExceptionList.CREATE_POST_ERROR;
        }
    }

    /**
     * @summary 해당 글과 글의 내용 가져오기
     * @param postId
     * @return PostContentDto
     * @throws POST_CONTENT_NOT_FOUND
     * @throws POST_NOT_FOUND
     */
    async getPostWithContentAndSeries(postId : number): Promise<PostWithContentDto | PostWithContentAndSeriesDto>{
        const postWithContentsAndSeries: PostWithContentAndSeries | null = await this.prismaService.postContent.findFirst({
            where: {
                postId,
            },
            include:{
                post: {
                    include:{
                        series: true
                    }
                }
            },
            relationLoadStrategy: 'join',
            orderBy:{
                createdAt : 'desc'
            }
        })

        if(!postWithContentsAndSeries) throw ExceptionList.POST_CONTENT_NOT_FOUND;
        if(!postWithContentsAndSeries.post) throw ExceptionList.POST_NOT_FOUND;

        const {post, ...postContent} = postWithContentsAndSeries;
        const {series, ...postData} = post;
        if(series){
            return {
                post: PostDtoMapper.PostToPostDto(postData),
                postContent: PostDtoMapper.PostContentToPostContentDto(postContent),
                series: SeriesDtoMapper.SeriesToSeriesDto(series)
            }
        }
        return {
            post: PostDtoMapper.PostToPostDto(postData),
            postContent: PostDtoMapper.PostContentToPostContentDto(postContent)
        }
    }

    /**
     * @summary 해당 글과 글의 내용, 시리즈와 작성자 및 유저 정보 가져오기
     * @param postId
     * @return PostWithContentAndSeriesAndWriterDto
     * @throws POST_CONTENT_NOT_FOUND
     * @throws POST_NOT_FOUND
     */
    async getPostWithContentAndSeriesAndWriter(postId: number): Promise<PostWithContentAndSeriesAndWriterDto> {
        const postWithContentAndSeriesAndWriterUser = await this.prismaService.postContent.findFirst({
            where: {
                postId,
            },
            include:{
                post: {
                    include:{
                        series: true,
                        writerInfo: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            },
            relationLoadStrategy: 'join',
            orderBy:{
                createdAt : 'desc'
            }
        })

        if(!postWithContentAndSeriesAndWriterUser) throw ExceptionList.POST_CONTENT_NOT_FOUND;
        if(!postWithContentAndSeriesAndWriterUser.post) throw ExceptionList.POST_NOT_FOUND;

        const {post, ...postContent} = postWithContentAndSeriesAndWriterUser;
        const {series, writerInfo, ...postData} = post;
        const {user, ...writer} = writerInfo;
        return {
            post: PostDtoMapper.PostToPostDto(postData),
            postContent: PostDtoMapper.PostContentToPostContentDto(postContent),
            series: series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
            user : UserDtoMapper.UserToUserDto(user),
            writerInfo : UserDtoMapper.WriterInfoToWriterInfoDto(writer)
        }
    }

    /**
     * @summary 해당 글의 메타데이터 가져오기
     * @param postId
     * @return PostDto
     */
    async getPostById(postId: number): Promise<PostDto> {
        const post = await this.prismaService.post.findUnique({
            where : {
                id : postId
            }
        })
        if(!post) throw ExceptionList.POST_NOT_FOUND;
        return PostDtoMapper.PostToPostDto(post);
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

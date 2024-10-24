import {Injectable} from '@nestjs/common';
import {PostDto, PostWithContentAndSeriesDto,
    PostWithContentDto,
    PostContentDto,
    PostWithContentAndSeriesAndWriterDto
} from "./dto";
import {PrismaService} from "../prisma/prisma.service";
import PostDtoMapper from "./postDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import {UtilService} from "../util/util.service";
import {AuthValidationService} from "../auth/auth.validation.service";
import {CreatePostContentDto} from "./server-dto/createPostContent.dto";
import {PostWithContents} from "./prisma/postWithContents.prisma.type";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import {PostWithContentAndSeries} from "./prisma/postWithContentAndSeries.prisma";
import UserDtoMapper from "../user/userDtoMapper";
import {EditorJsToPostPreview} from "@moonjin/editorjs";
import {PostWithSeries} from "./prisma/postWithSeries.prisma.type";
import {WriterInfoDtoMapper} from "../writerInfo/writerInfoDtoMapper";
import {SeriesService} from "../series/series.service";
import {UpdatePostDto} from "./server-dto/updatePost.dto";

@Injectable()
export class PostService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly authValidationService: AuthValidationService,
        private readonly seriesService: SeriesService,
    ) {}

    /**
     * @summary 게시글 생성
     * @param createPostData
     * @param writerId
     * @return PostWithContentDto
     * @throws CREATE_POST_ERROR
     */
    async createPost(createPostData : UpdatePostDto, writerId: number) : Promise<PostWithContentDto> {
        const cover = this.utilService.processImageForCover(createPostData.cover);
        const {content,...postMetaData} = createPostData
        try {
            const post = await this.prismaService.post.create({
                data: {
                    ...postMetaData,
                    preview: EditorJsToPostPreview(content.blocks),
                    writerId,
                    cover,
                    postContent: {
                        create: {
                            content: JSON.stringify(content),
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
    async updatePost(postId: number, updatePostData: UpdatePostDto): Promise<PostWithContentDto> {
        const cover = this.utilService.processImageForCover(updatePostData.cover);
        const {content,category,...postMetaData} = updatePostData
        try {
            const post = await this.prismaService.post.update({
                where :{
                    id : postId
                },
                data: {
                    ...postMetaData,
                    preview: EditorJsToPostPreview(content.blocks),
                    cover,
                    category,
                    postContent: {
                        create: {
                            content: JSON.stringify(content)
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
     * @param writerId
     * @return PostWithSeriesDto[]
     * @throws USER_NOT_WRITER
     */
    async getWritingPostList(writerId: number): Promise<PostWithSeries[]> {
        await this.authValidationService.assertWriter(writerId);
        try{
            return await this.prismaService.post.findMany({
                where : {
                    writerId,
                    deleted : false,
                    newsletter : null
                },
                include: {
                    series : true,
                },
                relationLoadStrategy: 'join',
                orderBy : {
                    createdAt : 'desc',
                }
            })
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
            const deletedPost = await this.prismaService.post.update({
                where : {
                    id : postId
                },
                data : {
                    deleted : true,
                }
            })
            if(deletedPost.seriesId > 0)
                await this.seriesService.updateSeriesNewsletterCount(deletedPost.seriesId);
            // TODO : 작가의 newsletter 수도 줄여야하나?
        }catch (error){
            console.error(error);
        }
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
                    content : JSON.stringify(postContentData.content)
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
            writerInfo : WriterInfoDtoMapper.WriterInfoToWriterInfoDto(writer)
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
     * @summary 작성중인 글을 id로 가져오기
     * @param postId
     * @return PostWithContentAndSeriesAndWriterDto
     * @throws POST_NOT_FOUND
     * @throws POST_CONTENT_NOT_FOUND
     * @throws NEWSLETTER_ALREADY_EXIST
     */
    async getWritingPostAndPostContentAndWriterById(postId: number): Promise<PostWithContentAndSeriesAndWriterDto>{
        const postWithContent = await this.prismaService.post.findUnique({
            where: {
                id : postId,
                deleted : false,
            },
            include: {
                postContent: {
                    orderBy: {
                        createdAt : 'desc'
                    }
                },
                writerInfo : {
                    include: {
                        user : true
                    }
                },
                newsletter: true,
                series : true
            }
        })
        if(!postWithContent) throw ExceptionList.POST_NOT_FOUND;
        if(postWithContent.postContent.length == 0) throw ExceptionList.POST_CONTENT_NOT_FOUND;
        if(postWithContent.newsletter) throw ExceptionList.NEWSLETTER_ALREADY_EXIST;
        const {postContent,series,writerInfo,...postData} = postWithContent;
        const {user,...writerInfoData} = writerInfo;
        return {
            post : PostDtoMapper.PostToPostDto(postData),
            postContent : PostDtoMapper.PostContentToPostContentDto(postContent[0]),
            user: UserDtoMapper.UserToUserDto(user),
            writerInfo : WriterInfoDtoMapper.WriterInfoToWriterInfoDto(writerInfoData),
            series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null
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

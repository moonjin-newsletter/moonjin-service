import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ExceptionList} from "../response/error/errorInstances";
import {NewsletterSummaryDto, SearchNewsletterOptionDto} from "./dto";
import NewsletterDtoMapper from "./newsletterDtoMapper";
import {PostWithContentAndSeriesAndWriterDto} from "../post/dto";
import {PostService} from "../post/post.service";
import {SubscribeService} from "../subscribe/subscribe.service";
import {sendNewsLetterWithHtmlDto} from "../mail/dto";
import {MailService} from "../mail/mail.service";
import {
    NewsletterWithPostWithWriterAndSeries,
} from "./prisma/NewsletterWithPostWithWriterAndSeries.prisma.type";
import {EditorJsToHtml} from "@moonjin/editorjs";
import {PaginationOptionsDto} from "../common/pagination/dto";
import {WebNewsletterWithNewsletterWithPost} from "./prisma/webNewsletterWithNewsletterWithPost.prisma.type";
import {Category} from "@moonjin/api-types";
import {SeriesService} from "../series/series.service";
import {NewsletterWithPostAndContentAndWriter} from "./prisma/newsletterWithPostAndContentAndWriter.prisma.type";
import {NewsletterLike} from "@prisma/client";
import {CategoryEnum} from "../post/enum/category.enum";
import {WriterInfoService} from "../writerInfo/writerInfo.service";
import {IUpdateNewsletter} from "./api-types/IUpdateNewsletter";


@Injectable()
export class NewsletterService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService:MailService,
        private readonly postService: PostService,
        private readonly subscribeService: SubscribeService,
        private readonly seriesService : SeriesService,
        private readonly writerInfoService : WriterInfoService
    ) {}

    /**
     * @summary 해당 유저의 받은 뉴스레터 목록 가져오기
     * @param receiverId
     * @param seriesOnly
     * @return NewsletterDto[]
     */
    async getReceivedNewsletterListByUserId(receiverId : number, seriesOnly = false) : Promise<WebNewsletterWithNewsletterWithPost[]>{
        return this.prismaService.webNewsletter.findMany({
            where : {
                receiverId,
                newsletter : {
                    post : {
                        series : seriesOnly ? {
                            id : {
                                gt : 0
                            }
                        } : undefined
                    }
                },

            },
            include:{
                newsletter: {
                    include : {
                        post : {
                            include : {
                                writerInfo : {
                                    include : {
                                        user : true
                                    }
                                },
                                series : true
                            }
                        }
                    }
                }
            },
            relationLoadStrategy: 'join',
            orderBy : {
                newsletter : {
                    sentAt : 'desc'
                }
            },
        })
    }


    /**
     * @summary 해당 글을 뉴스레터로 발송
     * @param postId
     * @param writerId
     * @param newsletterTitle
     */
    async sendNewsLetter(postId: number, writerId: number,newsletterTitle: string){
        // 1. 해당 글이 보낼 수 있는 상태인지 확인
        const postWithContentAndSeriesAndWriter = await this.assertNewsletterCanBeSent(writerId, postId);
        let isNewsletterSent = false;

        // 2. 구독자 목록 가져오기
        const receiverList = await this.subscribeService.getAllSubscriberByWriterId(writerId);
        const receiverEmailSet = new Set(receiverList.externalSubscriberList.map(subscriber => subscriber.subscriberEmail));
        receiverList.subscriberList.forEach(follower => {
            receiverEmailSet.add(follower.user.email)
        })
        receiverEmailSet.add(postWithContentAndSeriesAndWriter.user.email);
        const receiverEmailList = Array.from(receiverEmailSet);
        const receiverIdList = receiverList.subscriberList.map(subscriber => subscriber.user.id);

        try{
            const newsletter = await this.prismaService.newsletter.create({
                data : {
                    id : postId,
                    postId,
                    postContentId: postWithContentAndSeriesAndWriter.postContent.id,
                    webNewsletter : {
                        createMany : {
                            data : receiverIdList.map(receiverId => {
                                return {
                                    receiverId
                                }
                            }),
                            skipDuplicates : true
                        }
                    },
                    newsletterSend: {
                        create: {
                            title: newsletterTitle,
                            mailNewsletter: {
                                createMany: {
                                    data: receiverEmailList.map(email => {
                                        return {
                                            receiverEmail: email
                                        }
                                    }),
                                    skipDuplicates: true
                                }
                            }
                        }
                    }
                },
                include : {
                    newsletterSend : {
                        include: {
                            mailNewsletter : true
                        },
                        orderBy: {
                            id: 'desc'
                        }
                    }
                }
            })

            console.log("done")
            const newsletterSendInfo : sendNewsLetterWithHtmlDto = {
                newsletterId : newsletter.id,
                senderName : postWithContentAndSeriesAndWriter.user.nickname,
                senderMailAddress : postWithContentAndSeriesAndWriter.writerInfo.moonjinId + "@" + process.env.MAILGUN_DOMAIN,
                subject : newsletterTitle,
                html : EditorJsToHtml(postWithContentAndSeriesAndWriter.postContent.content,postWithContentAndSeriesAndWriter, newsletter.id),
                emailList : receiverEmailList
            };
            await this.mailService.sendNewsLetterWithHtml(newsletterSendInfo);
            isNewsletterSent = true;
            if(postWithContentAndSeriesAndWriter.post.seriesId > 0)
                await this.seriesService.updateSeriesNewsletterCount(postWithContentAndSeriesAndWriter.post.seriesId);
            await this.writerInfoService.synchronizeNewsLetter(writerId);
            return newsletter;
        }catch (error){
            console.log(error)
            if(!isNewsletterSent){ // 뉴스레터 전송 실패 시 롤백
                await this.prismaService.newsletter.delete({
                    where : {
                        id : postId
                    },
                    include : {
                        newsletterSend : true,
                        webNewsletter : true
                    }
                })
            }
            throw ExceptionList.SEND_NEWSLETTER_ERROR;
        }
    }

    /**
     * @summary 뉴스레터 summary 가져오기
     * @param newsletterId
     * @return NewsletterSummaryDto
     * @throws NEWSLETTER_NOT_FOUND
     */
    async getNewsletterSummaryById(newsletterId: number): Promise<NewsletterSummaryDto>{
        const newsletter = await this.prismaService.newsletter.findUnique({
            where: {
                id: newsletterId
            },
        })
        if(!newsletter) throw ExceptionList.NEWSLETTER_NOT_FOUND;
        return NewsletterDtoMapper.newsletterToNewsletterSummaryDto(newsletter);
    }

    /**
     * @summary 뉴스레터 전송 가능 여부 확인
     * @param userId
     * @param postId
     * @throws POST_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     * @throws NEWSLETTER_CATEGORY_NOT_FOUND
     */
    async assertNewsletterCanBeSent(userId: number, postId: number): Promise<PostWithContentAndSeriesAndWriterDto>{
        const postWithContentAndSeriesAndWriter = await this.postService.getWritingPostAndPostContentAndWriterById(postId);
        if(userId != postWithContentAndSeriesAndWriter.post.writerId) throw ExceptionList.FORBIDDEN_FOR_POST;
        if(!Category.isValidCategory(postWithContentAndSeriesAndWriter.post.category)) throw ExceptionList.NEWSLETTER_CATEGORY_NOT_FOUND;
        return postWithContentAndSeriesAndWriter;
    }

    /**
     * @summary 해당 유저의 발행한 뉴스레터 목록 가져오기
     * @param writerId
     * @param paginationOptions
     * @return SentNewsletterWithCounts[]
     */
    async getSentNewsletterListByWriterId(writerId: number, paginationOptions?:PaginationOptionsDto): Promise<NewsletterWithPostWithWriterAndSeries[]>{
        return this.prismaService.newsletter.findMany({
            where : {
                post : {
                    writerId,
                    deleted : false
                },
            },
            include: {
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
            },
            skip: paginationOptions?.skip,
            take: paginationOptions?.take,
            cursor: paginationOptions?.cursor ? {
                id : paginationOptions.cursor
            } : undefined
        })
    }

    /**
     * @summary 해당 유저의 게시글 목록 가져오기
     * @param moonjinId
     * @param paginationOptions
     * @return SentNewsletterWithCounts[]
     */
    async getAllSentNewsletterListByMoonjinId(moonjinId: string, paginationOptions?:PaginationOptionsDto): Promise<NewsletterWithPostWithWriterAndSeries[]>{
        return this.prismaService.newsletter.findMany({
            where : {
                post : {
                    writerInfo:{
                        moonjinId
                    },
                    deleted : false,
                },
            },
            include: {
                post : {
                    include : {
                        writerInfo : {
                            include : {
                                user : true
                            }
                        },
                        series : true
                    }
                },
            },
            relationLoadStrategy: 'join',
            orderBy : {
                id : 'desc'
            },
            skip: paginationOptions?.skip,
            take: paginationOptions?.take,
            cursor: paginationOptions?.cursor ? {
                id : paginationOptions.cursor
            } : undefined
        })
    }

    /**
     * @summary 해당 유저의 일반게시글 목록 가져오기
     * @param moonjinId
     * @param paginationOptions
     * @return SentNewsletterWithCounts[]
     */
    async getAllSentNormalNewsletterListByMoonjinId(moonjinId: string, paginationOptions?:PaginationOptionsDto): Promise<NewsletterWithPostWithWriterAndSeries[]>{
        return this.prismaService.newsletter.findMany({
            where : {
                post : {
                    writerInfo:{
                        moonjinId
                    },
                    seriesId : 0,
                    deleted : false,
                },
            },
            include: {
                post : {
                    include : {
                        writerInfo : {
                            include : {
                                user : true
                            }
                        },
                        series : true
                    }
                },
            },
            relationLoadStrategy: 'join',
            orderBy : {
                id : 'desc'
            },
            skip: paginationOptions?.skip,
            take: paginationOptions?.take,
            cursor: paginationOptions?.cursor ? {
                id : paginationOptions.cursor
            } : undefined
        })
    }

    /**
     * @summary 해당 시리즈의 뉴스레터 목록 가져오기 (w pagination)
     * @param seriesId
     * @param paginationOptions
     */
    async getNewsletterInSeriesBySeriesId(seriesId: number,  paginationOptions?:PaginationOptionsDto): Promise<NewsletterWithPostWithWriterAndSeries[]>{
        return this.prismaService.newsletter.findMany({
            where: {
                post : {
                    seriesId,
                    deleted : false
                },
            },
            include: {
                post : {
                    include : {
                        writerInfo : {
                            include : {
                                user : true
                            }
                        },
                        series : true
                    }
                }
            },
            relationLoadStrategy: 'join',
            orderBy : {
                sentAt : 'desc'
            },
            skip: paginationOptions?.skip,
            take: paginationOptions?.take,
            cursor: paginationOptions?.cursor ? {
                id : paginationOptions.cursor
            } : undefined
        })
    }

    /**
     * @summary 해당 뉴스레터의 Card 데이터 가져오기
     * @param newsletterId
     * @return NewsletterWithPostWithWriterAndSeries
     * @throws NEWSLETTER_NOT_FOUND
     */
    async getNewsletterCardByNewsletterId(newsletterId: number): Promise<NewsletterWithPostWithWriterAndSeries>{
        const newsletter : NewsletterWithPostWithWriterAndSeries | null = await this.prismaService.newsletter.findUnique({
            where: {
                id: newsletterId
            },
            include : {
                post : {
                    include : {
                        writerInfo : {
                            include : {
                                user : true
                            }
                        },
                        series : true
                    }
                }
            }
        })
        if(!newsletter) throw ExceptionList.NEWSLETTER_NOT_FOUND;
        return newsletter;
    }


    /**
     * @summary 해당 뉴스레터의 모든 데이터 가져오기
     * @param newsletterId
     * @return NewsletterWithPostAndContentAndWriter
     * @throws NEWSLETTER_NOT_FOUND
     */
    async getNewsletterAllDataById(newsletterId: number): Promise<NewsletterWithPostAndContentAndWriter>{
        try {
            return await this.prismaService.newsletter.findUniqueOrThrow({
                where: {
                    id: newsletterId
                },
                include: {
                    post: {
                        include: {
                            writerInfo: {
                                include: {
                                    user: true
                                }
                            },
                            series: true
                        }
                    },
                    postContent: true
                }
            })
        }catch (error){
            throw ExceptionList.NEWSLETTER_NOT_FOUND
        }
    }

    /**
     * @summary 해당 뉴스레터에 좋아요 누르기
     * @param newsletterId
     * @param userId
     * @throws NEWSLETTER_NOT_FOUND
     */
    async likeNewsletter(newsletterId: number, userId: number): Promise<void>{
        await this.assertNewsletterExist(newsletterId);
        try{
            await this.prismaService.newsletterLike.create({
                data : {
                    newsletterId,
                    userId,
                }
            })
            await this.synchronizeNewsletterLikeCount(newsletterId);
        }catch (error){}
    }

    /**
     * @summary 해당 뉴스레터에 좋아요 제거
     * @param newsletterId
     * @param userId
     */
    async unlikeNewsletter(newsletterId: number, userId: number): Promise<void>{
        try{
            await this.prismaService.newsletterLike.deleteMany({
                where : {
                    newsletterId,
                    userId
                }
            })
            await this.synchronizeNewsletterLikeCount(newsletterId);
        }catch (error){}
    }

    /**
     * @summary 해당 뉴스레터가 존재하는 지 확인
     * @param newsletterId
     * @throws NEWSLETTER_NOT_FOUND
     */
    async assertNewsletterExist(newsletterId: number): Promise<void>{
        const newsletter = await this.prismaService.newsletter.findUnique({
            where:{
                id : newsletterId,
                post: {
                    deleted : false
                }
            },
            relationLoadStrategy: 'join'
        })
        if(newsletter == null) throw ExceptionList.NEWSLETTER_NOT_FOUND;
    }

    /**
     * @summary 해당 뉴스레터에 해당 유저가 작성자인지 확인
     * @param newsletterId
     * @param writerId
     * @throws NEWSLETTER_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     */
    async assertNewslettersWriter(newsletterId: number, writerId: number): Promise<void>{
        const newsletter = await this.prismaService.newsletter.findUnique({
            where:{
                id : newsletterId,
                post: {
                    deleted : false
                }
            },
            include: {
                post : true
            },
            relationLoadStrategy: 'join'
        })
        if(newsletter == null) throw ExceptionList.NEWSLETTER_NOT_FOUND;
        if(newsletter.post.writerId != writerId) throw ExceptionList.FORBIDDEN_FOR_POST
    }

    /**
     * @summary 해당 뉴스레터에 해당 유저가 좋아요를 눌렀는지 가져오기
     * @param userId
     * @param newsletterId
     * @return NewsletterLike
     * @throws LIKE_NOT_FOUND
     */
    async getNewsletterLike(userId: number, newsletterId: number): Promise<NewsletterLike>{
        try{
            return this.prismaService.newsletterLike.findUniqueOrThrow({
                where : {
                    newsletterId_userId : {
                        userId,
                        newsletterId
                    }
                }
            })
        }catch (error){
            throw ExceptionList.LIKE_NOT_FOUND;
        }
    }

    /**
     * @summary 해당 카테고리의 최신순 글 무직위 가져오기
     * @param category
     * @param paginationOptions
     * @return NewsletterWithPostWithWriterAndSeries[]
     */
    async getRecommendNewsletterListByCategory(category? : CategoryEnum, paginationOptions?:PaginationOptionsDto): Promise<NewsletterWithPostWithWriterAndSeries[]>{
        return this.prismaService.newsletter.findMany({
            where : {
                post : {
                    category,
                    deleted : false
                }
            },
            include: {
                post : {
                    include : {
                        writerInfo : {
                            include : {
                                user : true
                            }
                        },
                        series : true
                    }
                }
            },
            relationLoadStrategy: 'join',
            orderBy : {
                sentAt : 'desc'
            },
            skip: paginationOptions?.skip,
            take: paginationOptions?.take,
            cursor: paginationOptions?.cursor ? {
                id : paginationOptions.cursor
            } : undefined
        })
    }

    /**
     * @summary 뉴스레터 수정하기
     * @param newsletterId
     * @param body
     */
    async updateNewsletter(newsletterId : number, body: IUpdateNewsletter){
        try{
            const postContent = await this.postService.uploadPostContent({postId: newsletterId, content: body.content});
            const updateNewsletter = this.prismaService.newsletter.update({
                where : {
                    id : newsletterId,
                },
                data : {
                    postContentId: postContent.id,
                }
            })
            const updatePost = this.prismaService.post.update({
                where : {
                    id : newsletterId
                },
                data : {
                    title: body.title,
                    subtitle: body.subtitle,
                }
            })
            await this.prismaService.$transaction([updateNewsletter, updatePost])
        }catch (error){
            throw ExceptionList.NEWSLETTER_NOT_FOUND;
        }
    }

    /**
     * @summary 뉴스레터 삭제하기
     * @param newsletterId
     */
    async deleteNewsletter(newsletterId: number){
        try{
            const newsletter = await this.prismaService.newsletter.update({
                where : {
                    id : newsletterId
                },
                include:{
                    post : true
                },
                data : {
                    post : {
                        update : {
                            deleted : true
                        }
                    }
                },
                relationLoadStrategy: 'join'
            })
            await this.writerInfoService.synchronizeNewsLetter(newsletter.post.writerId)
        }catch (error) {
            throw ExceptionList.NEWSLETTER_NOT_FOUND;
        }
    }

    /**
     * @summary 뉴스레터 좋아요 수 동기화
     * @param newsletterId
     * @throws NEWSLETTER_NOT_FOUND
     */
    async synchronizeNewsletterLikeCount(newsletterId: number): Promise<void>{
        try{
            const likes = await this.prismaService.newsletterLike.count({
                where: {
                    newsletterId
                }
            })
            await this.prismaService.newsletter.update({
                where: {
                    id: newsletterId
                },
                data: {
                    likes
                }
            })
        }catch (error){
            throw ExceptionList.NEWSLETTER_NOT_FOUND
        }
    }

    /**
     * @summary 뉴스레터 큐레이션 목록 가져오기
     * @return NewsletterWithPostWithWriterAndSeries[] (10개)
     * @description 뉴스레터 큐레이션 10개 가져오기 (삭제된 뉴스레터 제외), 부족하면 인기 뉴스레터에서 가져오기
     * @throws NEWSLETTER_NOT_FOUND
     */
    async getNewsletterCurationList(): Promise<NewsletterWithPostWithWriterAndSeries[]>{
        const NEWSLETTER_CURATION_COUNT = 10;
        try{
            const newsletterCurationList = await this.prismaService.newsletterCurationWeekly.findMany({
                where:{
                    newsletter:{
                        post: {
                            deleted : false
                        }
                    }
                },
                include: {
                    newsletter : {
                        include: {
                            post : {
                                include : {
                                    writerInfo : {
                                        include : {
                                            user : true
                                        }
                                    },
                                    series : true
                                }
                            },
                        }
                    }
                },
                orderBy :{
                    order : 'asc'
                },
                take: NEWSLETTER_CURATION_COUNT
            })
            const searchNewsletterOption = {
                category : "",
                seriesOnly : false,
                sort : "popular"
            }
            const paginationOptions = {
                skip : 0,
                pageNo : 1,
                take : NEWSLETTER_CURATION_COUNT - newsletterCurationList.length
            }
            const recentNewsletterList = await this.getNewsletterList(searchNewsletterOption,paginationOptions);
            const resultList : NewsletterWithPostWithWriterAndSeries[] = [];
            newsletterCurationList.forEach(newsletterCuration => {
                if(newsletterCuration.newsletter)
                    resultList.push(newsletterCuration.newsletter)
            })
            return resultList.concat(recentNewsletterList);
        }catch (error){
            console.log(error)
            throw ExceptionList.NEWSLETTER_NOT_FOUND;
        }
    }

    /**
     * @summary 뉴스레터 큐레이션 생성
     * @param newsletterIdList
     * @return number
     * @throws NEWSLETTER_ALREADY_EXIST
     */
    async createNewsletterCuration(newsletterIdList : number[]):Promise<number>{
        try{
            const newsletterCurationList = newsletterIdList.slice(0,10).map((newsletterId, index) => {
                return {
                    newsletterId,
                    order : index
                }
            })
            const clearCuration = this.prismaService.newsletterCurationWeekly.deleteMany({});
            const createCuration = this.prismaService.newsletterCurationWeekly.createMany({
                data : newsletterCurationList
            })
            await this.prismaService.$transaction([clearCuration,createCuration])
            return newsletterCurationList.length
        }catch (error){
            console.log(error)
            throw ExceptionList.NEWSLETTER_ALREADY_EXIST;
        }
    }

    /**
     * @summary 뉴스레터 목록 가져오기
     * @param searchNewsletterOption
     * @param paginationOptions
     */
    async getNewsletterList( searchNewsletterOption : SearchNewsletterOptionDto, paginationOptions? : PaginationOptionsDto): Promise<NewsletterWithPostWithWriterAndSeries[]>{
        const {category, seriesOnly, sort} = searchNewsletterOption;
        const categoryNumber = Category.getNumberByCategory(category);
        try{
            return await this.prismaService.newsletter.findMany({
                where: {
                    post: {
                        deleted: false,
                        category : categoryNumber != -1 ? categoryNumber : undefined,
                        series: {
                            id : seriesOnly ? {
                                gt : 0
                            } : undefined
                        }
                    }
                },
                include: {
                    post : {
                        include : {
                            writerInfo : {
                                include : {
                                    user : true
                                }
                            },
                            series : true
                        }
                    }
                },
                orderBy : (sort == "recent") ? {
                    sentAt : 'desc'
                } : {
                    likes : 'desc',
                },
                skip: paginationOptions?.skip,
                take: paginationOptions?.take,
                cursor: paginationOptions?.cursor ? {
                    id : paginationOptions.cursor
                } : undefined
            })
        }catch (error){
            console.log(error)
            return [];
        }
    }

    /**
     * @summary 인기있는 시리즈의 뉴스레터 목록 가져오기
     * @param category
     * @param paginationOptions
     */
    async getPopularSeriesNewsletterList(category? : string, paginationOptions? : PaginationOptionsDto): Promise<NewsletterWithPostWithWriterAndSeries[]>{
        const categoryNumber = Category.getNumberByCategory(category);
        try{
            return await this.prismaService.newsletter.findMany({
                where: {
                    post: {
                        seriesId : {
                            gt : 0
                        },
                        series: {},
                        deleted: false,
                        category : categoryNumber != -1 ? categoryNumber : undefined
                    }
                },
                include: {
                    post : {
                        include : {
                            writerInfo : {
                                include : {
                                    user : true
                                }
                            },
                            series : true
                        }
                    }
                },
                orderBy : {
                    post: {
                        series: {
                            likes: 'desc'
                        }
                    }
                },
                skip: paginationOptions?.skip,
                take: paginationOptions?.take,
                cursor: paginationOptions?.cursor ? {
                    id : paginationOptions.cursor
                } : undefined
            })
        }catch (error){
            console.log(error)
            return [];
        }

    }
}

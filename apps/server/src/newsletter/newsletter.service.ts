import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ExceptionList} from "../response/error/errorInstances";
import {NewsletterWithPostAndSeriesAndWriterUser} from "./prisma/newsletterWithPost.prisma.type";
import {NewsletterDto, NewsletterSummaryDto} from "./dto";
import NewsletterDtoMapper from "./newsletterDtoMapper";
import {PostWithContentAndSeriesAndWriterDto} from "../post/dto";

@Injectable()
export class NewsletterService {

    constructor(
        private readonly prismaService: PrismaService,
        // private readonly mailService:MailService,
        // private readonly postService: PostService,
        // private readonly utilService: UtilService,
        // private readonly userService: UserService,
        // private readonly subscribeService: SubscribeService
    ) {}

    /**
     * @summary 해당 유저의 뉴스레터 목록 가져오기
     * @param userId
     * @param seriesOnly
     * @return NewsletterDto[]
     */
    async getNewsletterListByUserId(userId : number, seriesOnly = false) : Promise<NewsletterDto[]>{
        const newsletterList : NewsletterWithPostAndSeriesAndWriterUser[] = await this.prismaService.newsletterInWeb.findMany({
            where : {
                receiverId : userId,
                newsletter : {
                    post : {
                        seriesId : seriesOnly ? {
                            gt : 0
                        } : undefined
                    },
                }
            },
            include:{
                newsletter :{
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
                    }
                }
            },
            relationLoadStrategy: 'join',
            orderBy : {
                newsletter : {
                    sentAt : 'desc'
                }
            }
        })
        if(newsletterList.length === 0) return [];
        return newsletterList.map(newsletter => NewsletterDtoMapper.newsletterWithPSWUToNewsletterDto(newsletter));
    }


    /**
     * @summary 해당 글을 뉴스레터로 발송
     * @param postId
     * @param writerId
     * @param newsletterTitle
     */
    async sendNewsLetter(_postId: number, _writerId: number, _newsletterTitle: string){
        // const postWithContent = await this.postService.getPostWithContentByPostId(postId);
        // const receiverList = await this.subscribeService.getAllSubscriberByWriterId(writerId);
        // const receiverIdList = receiverList.subscriberList.map(receiver => receiver.user.id);
        // const receiverEmailList = receiverList.externalSubscriberList.map(receiver => receiver.email);
        // receiverList.subscriberList.forEach(follower => {
        //     receiverEmailList.push(follower.user.email)
        // })
        //
        // try{
        //     await this.prismaService.newsletter.create({
        //         data : {
        //             postId,
        //             postContentId : postWithContent.postContent.id,
        //             title: newsletterTitle,
        //             sentAt: this.utilService.getCurrentDateInKorea(),
        //             newsletterInWeb : {
        //                 createMany : {
        //                     data : receiverIdList.map(receiverId => {
        //                         return {
        //                             receiverId
        //                         }
        //                     }),
        //                     skipDuplicates : true
        //                 }
        //             },
        //             newsletterInMail : {
        //                 createMany : {
        //                     data : receiverEmailList.map(email => {
        //                         return {
        //                             receiverEmail : email
        //                         }
        //                     }),
        //                     skipDuplicates : true
        //                 }
        //             }
        //         },
        //     });
        //     const writerInfo = await this.userService.getWriterInfoByUserId(writerId);
        //     const newsletterSendInfo : sendNewsLetterWithHtmlDto = {
        //         senderName : writerInfo.user.nickname,
        //         senderMailAddress : writerInfo.writerInfo.moonjinId + "@" + process.env.MAILGUN_DOMAIN,
        //         subject : newsletterTitle,
        //         html : editorJsToHtml(postWithContent.postContent.content),
        //         emailList : receiverEmailList
        //     };
        //     return await this.mailService.sendNewsLetterWithHtml(newsletterSendInfo);
        // }catch (error){
        //     throw ExceptionList.SEND_NEWSLETTER_ERROR;
        // }


    }

    /**
     * 해당 유저들에게 Web 뉴스레터 전송하기
     * @param newsletterId
     * @param receiverIdList
     * @return 전송된 뉴스레터 수
     * @throws SEND_NEWSLETTER_ERROR
     */
    async sendNewsletterInWeb(newsletterId: number, receiverIdList: number[]): Promise<number>{
        try{
            const newsletterSentResult = await this.prismaService.newsletterInWeb.createMany({
                data : receiverIdList.map(receiverId => {
                    return {
                        newsletterId,
                        receiverId
                    }
                }),
                skipDuplicates : true
            });
            return newsletterSentResult.count;
        }catch (error){
            console.error(error);
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
            include: {
                post: true
            }
        })
        if(!newsletter) throw ExceptionList.NEWSLETTER_NOT_FOUND; // TODO : post가 없는 경우는 어떻게 해야할까?
        return {
            newsletter : {
                id : newsletter.id,
                title : newsletter.title,
                sentAt : newsletter.sentAt
            },
            post : {
                cover : newsletter.post.cover
            }
        }
    }

    /**
     * @summary 뉴스레터 전송 가능 여부 확인
     * @param userId
     * @param postWithContentAndSeriesAndWriter
     * @throws FORBIDDEN_FOR_POST
     * @throws NEWSLETTER_CATEGORY_NOT_FOUND
     */
    async assertNewsletterCanBeSent(userId: number, postWithContentAndSeriesAndWriter : PostWithContentAndSeriesAndWriterDto){
        if(userId != postWithContentAndSeriesAndWriter.writerInfo.userId) throw ExceptionList.FORBIDDEN_FOR_POST;
        if(postWithContentAndSeriesAndWriter.post.category == null || postWithContentAndSeriesAndWriter.post.category == "") throw ExceptionList.NEWSLETTER_CATEGORY_NOT_FOUND;
    }
}

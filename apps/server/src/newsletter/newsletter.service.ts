import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ExceptionList} from "../response/error/errorInstances";
import {NewsletterWithPostAndSeriesAndWriterUser} from "./prisma/newsletterWithPost.prisma.type";
import {NewsletterSummaryDto} from "./dto";
import NewsletterDtoMapper from "./newsletterDtoMapper";
import {PostWithContentAndSeriesAndWriterDto} from "../post/dto";
import {PostService} from "../post/post.service";
import {SubscribeService} from "../subscribe/subscribe.service";
import {UtilService} from "../util/util.service";
import {sendNewsLetterWithHtmlDto} from "../mail/dto";
import {MailService} from "../mail/mail.service";
import {SendMailEventsEnum} from "../mail/enum/sendMailEvents.enum";
import {SentNewsletterWithCounts} from "./prisma/sentNewsletterWithCounts.prisma.type";
import {EditorJsToHtml} from "@moonjin/editorjs";
import {PaginationOptionsDto} from "../common/pagination/dto";

@Injectable()
export class NewsletterService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService:MailService,
        private readonly postService: PostService,
        private readonly utilService: UtilService,
        // private readonly userService: UserService,
        private readonly subscribeService: SubscribeService
    ) {}

    /**
     * @summary 해당 유저의 받은 뉴스레터 목록 가져오기
     * @param userId
     * @param seriesOnly
     * @return NewsletterDto[]
     */
    async getNewsletterListByUserId(userId : number, seriesOnly = false) : Promise<NewsletterWithPostAndSeriesAndWriterUser[]>{
        return this.prismaService.newsletterInWeb.findMany({
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
    }


    /**
     * @summary 해당 글을 뉴스레터로 발송
     * @param postId
     * @param userId
     * @param newsletterTitle
     */
    async sendNewsLetter(postId: number, userId: number, newsletterTitle: string): Promise<number>{
        const postWithContentAndSeriesAndWriter = await this.postService.getPostWithContentAndSeriesAndWriter(postId);
        await this.assertNewsletterCanBeSent(userId, postWithContentAndSeriesAndWriter);
        const receiverList = await this.subscribeService.getAllSubscriberByWriterId(postWithContentAndSeriesAndWriter.writerInfo.userId);
        const receiverEmailSet = new Set(receiverList.externalSubscriberList.map(subscriber => subscriber.email));
        receiverList.subscriberList.forEach(follower => {
            receiverEmailSet.add(follower.user.email)
        })
        receiverEmailSet.add(postWithContentAndSeriesAndWriter.user.email); // 본인 이메일 추가제거
        const receiverEmailList = Array.from(receiverEmailSet);

        try{
            const newsletter = await this.prismaService.newsletter.create({
                data : {
                    postId,
                    postContentId : postWithContentAndSeriesAndWriter.postContent.id,
                    title: newsletterTitle,
                    sentAt: this.utilService.getCurrentDateInKorea(),
                    cover : postWithContentAndSeriesAndWriter.post.cover,
                    newsletterInWeb : {
                        createMany : {
                            data : receiverList.subscriberList.map(subscriber => {
                                return {
                                    receiverId :subscriber.user.id
                                }
                            }),
                            skipDuplicates : true
                        }
                    },
                    newsletterInMail : {
                        createMany:{
                            data : receiverEmailList.map(email => {
                                return {
                                    receiverEmail : email
                                }
                            }),
                            skipDuplicates : true
                        }
                    }
                },
            })

            const newsletterSendInfo : sendNewsLetterWithHtmlDto = {
                newsletterId : newsletter.id,
                senderName : postWithContentAndSeriesAndWriter.user.nickname,
                senderMailAddress : postWithContentAndSeriesAndWriter.writerInfo.moonjinId + "@" + process.env.MAILGUN_DOMAIN,
                subject : newsletterTitle,
                html : EditorJsToHtml(postWithContentAndSeriesAndWriter.postContent.content),
                emailList : receiverEmailList
            };
            await this.mailService.sendNewsLetterWithHtml(newsletterSendInfo);
            return receiverEmailList.length;
        }catch (error){
            throw ExceptionList.SEND_NEWSLETTER_ERROR;
        }
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
        })
        if(!newsletter) throw ExceptionList.NEWSLETTER_NOT_FOUND;
        return NewsletterDtoMapper.newsletterToNewsletterSummaryDto(newsletter);
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

    /**
     * @summary 해당 유저의 발송한 뉴스레터 목록 가져오기
     * @param writerId
     * @param paginationOptions
     * @return SentNewsletterWithCounts[]
     */
    async getSentNewsletterListByWriterId(writerId: number, paginationOptions?:PaginationOptionsDto): Promise<SentNewsletterWithCounts[]>{
        return this.prismaService.newsletter.findMany({
            where : {
                post : {
                    writerId
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
                },
                _count : {
                    select : {
                        newsletterInMail : true,
                        newsletterAnalytics : {
                            where : {
                                event : SendMailEventsEnum.delivered
                            }
                        }
                    },
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
}

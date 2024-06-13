import {Controller, UseGuards} from '@nestjs/common';
import {TypedBody, TypedParam, TypedQuery, TypedRoute} from "@nestia/core";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {ISendNewsLetter} from "./api-types/ISendNewsLetter";
import {PostService} from "../post/post.service";
import {Try, TryCatch} from "../response/tryCatch";
import {
    FORBIDDEN_FOR_POST,
    NEWSLETTER_CATEGORY_NOT_FOUND, NEWSLETTER_NOT_FOUND,
    POST_CONTENT_NOT_FOUND,
    POST_NOT_FOUND
} from "../response/error/post";
import {createResponseForm, ResponseMessage} from "../response/responseForm";
import {NewsletterService} from "./newsletter.service";
import {UserService} from "../user/user.service";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {IGetNewsletter} from "./api-types/IGetNewsletter";
import { NewsletterSummaryDto, SendNewsletterResultDto, NewsletterCardDto} from "./dto";
import {ISendTesNewsletter} from "./api-types/ISendTestNewsletter";
import {USER_NOT_WRITER} from "../response/error/auth";
import {ExceptionList} from "../response/error/errorInstances";
import {MailService} from "../mail/mail.service";
import NewsletterDtoMapper from "./newsletterDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import {AssertEditorJsonDto, EditorJsToHtml} from "@moonjin/editorjs";

@Controller('newsletter')
export class NewsletterController {
    constructor(
        private readonly postService: PostService,
        private readonly userService: UserService,
        private readonly newsletterService: NewsletterService,
        private readonly mailService: MailService
    ) {}

    /**
     * @summary 해당 글을 뉴스레터로 발송
     * @param user
     * @param postId
     * @param body
     * @returns {sentCount: number}
     * @throws POST_NOT_FOUND
     * @throws NEWSLETTER_CATEGORY_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     * @throws POST_CONTENT_NOT_FOUND
     * @throws SEND_NEWSLETTER_ERROR
     * @throws USER_NOT_WRITER
     */
    @TypedRoute.Post(":postId")
    @UseGuards(WriterAuthGuard)
    async sendNewsletter(@User() user:UserAuthDto, @TypedParam("postId") postId: number, @TypedBody() body:ISendNewsLetter )
    :Promise<TryCatch<any, POST_NOT_FOUND | FORBIDDEN_FOR_POST>> {
        const sentCount = await this.newsletterService.sendNewsLetter(postId,user.id ,body.newsletterTitle);
        await this.userService.synchronizeNewsLetter(user.id, true);
        return createResponseForm({
            message : sentCount + "건의 뉴스레터를 발송했습니다.",
            sentCount,
        });
    }

    /**
     * @summary 테스트 뉴스레터 전송
     * @param user
     * @param postId
     * @param body
     * @returns {message: string}
     * @throws EMAIL_NOT_EXIST
     * @throws POST_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     * @throws NEWSLETTER_CATEGORY_NOT_FOUND
     * @throws POST_CONTENT_NOT_FOUND
     * @throws USER_NOT_WRITER
     */
    @TypedRoute.Post(':postId/test')
    @UseGuards(WriterAuthGuard)
    async sendTestNewsletter(@User() user:UserAuthDto, @TypedParam('postId') postId : number, @TypedBody() body:ISendTesNewsletter): Promise<TryCatch<
        ResponseMessage & {sentCount : number}, POST_NOT_FOUND | POST_CONTENT_NOT_FOUND | FORBIDDEN_FOR_POST | NEWSLETTER_CATEGORY_NOT_FOUND | USER_NOT_WRITER>>{
        if(body.receiverEmails.length == 0 || body.receiverEmails.length > 5) throw ExceptionList.EMAIL_NOT_EXIST;

        const postWithPostContentAndSeriesAndWriter = await this.postService.getPostWithContentAndSeriesAndWriter(postId);
        const postContent = postWithPostContentAndSeriesAndWriter.postContent.content;
        if(AssertEditorJsonDto(postContent) === false) throw ExceptionList.POST_CONTENT_NOT_FOUND; // TODO : 동작하는 지 테스트 필요
        await this.newsletterService.assertNewsletterCanBeSent(user.id, postWithPostContentAndSeriesAndWriter);

        await this.mailService.sendNewsLetterWithHtml({
            newsletterId: 0,
            emailList : body.receiverEmails,
            senderMailAddress : postWithPostContentAndSeriesAndWriter.writerInfo.moonjinId + "@" + process.env.MAILGUN_DOMAIN,
            senderName: user.nickname,
            subject: "[테스트 뉴스레터] "+postWithPostContentAndSeriesAndWriter.post.title,
            html: EditorJsToHtml(postContent)
        })

        return createResponseForm({
            message : body.receiverEmails.length + "건의 테스트 뉴스레터를 발송했습니다.",
            sentCount : body.receiverEmails.length,
        });
    }

    /**
     * @summary 해당 유저의 받은 뉴스레터 목록 가져오기
     * @param user
     * @param seriesOption
     * @returns NewsletterDto[]
     */
    @TypedRoute.Get('all')
    @UseGuards(UserAuthGuard)
    async getAllReceivedNewsletter(@User() user:UserAuthDto, @TypedQuery() seriesOption : IGetNewsletter) : Promise<Try<NewsletterCardDto[]>>{
        const newsletterWithPostAndSeriesAndWriterList = await this.newsletterService.getNewsletterListByUserId(user.id, seriesOption.seriesOnly?? false);
        return createResponseForm(newsletterWithPostAndSeriesAndWriterList.map(newsletterWithPostAndSeriesAndWriter => {
            const { post, ...newsletterData } = newsletterWithPostAndSeriesAndWriter.newsletter;
            const { writerInfo,series , ...postData } = post;
            return {
                newsletter : NewsletterDtoMapper.newsletterToNewsletterSummaryDto(newsletterData),
                post : {
                    id: postData.id,
                    preview : postData.preview
                },
                series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer : {
                    userId : writerInfo.userId,
                    moonjinId : writerInfo.moonjinId,
                    nickname : writerInfo.user.nickname
                }
            }
        }));
    }

    /**
     * @summary 해당 뉴스레터의 요약 정보 가져오기
     * @param newsletterId
     * @returns NewsletterSummaryDto
     * @throws NEWSLETTER_NOT_FOUND
     */
    @TypedRoute.Get(':newsletterId/summary')
    async getNewsletterSummaryById(@TypedParam("newsletterId") newsletterId: number) : Promise<TryCatch<NewsletterSummaryDto
    , NEWSLETTER_NOT_FOUND>>{
        const newsletterSummary = await this.newsletterService.getNewsletterSummaryById(newsletterId);
        return createResponseForm(newsletterSummary);
    }

    /**
     * @summary 해당 유저가 보낸 뉴스레터 목록 가져오기
     * @param user
     * @returns SendNewsletterResultDto[]
     */
    @TypedRoute.Get('send/all')
    @UseGuards(WriterAuthGuard)
    async getSentNewsletter(@User() user:UserAuthDto) : Promise<Try<SendNewsletterResultDto[]>>{
        const newsletterList = await this.newsletterService.getSentNewsletterListByWriterId(user.id);
        const newsletterResultList = newsletterList.map(newsletter => {
            const { _count, post, ...newsletterData} = newsletter;
            return {
                newsletter : NewsletterDtoMapper.newsletterToNewsletterSummaryDto(newsletterData),
                post : {
                    id : post.id,
                    preview : post.preview
                },
                series : post.series ? SeriesDtoMapper.SeriesToSeriesDto(post.series) : null,
                writer : {
                    userId : post.writerInfo.userId,
                    moonjinId : post.writerInfo.moonjinId,
                    nickname : post.writerInfo.user.nickname
                },
                analytics : {
                    deliveredCount : _count.newsletterAnalytics,
                    totalSentCount : _count.newsletterInMail
                }
            }
        })

        return createResponseForm(newsletterResultList);
    }

}

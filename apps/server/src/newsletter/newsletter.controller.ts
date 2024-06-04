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
import {NewsletterDto, NewsletterSummaryDto} from "./dto";
import {ISendTesNewsletter} from "./api-types/ISendTestNewsletter";
import {EMAIL_NOT_EXIST} from "../response/error/mail";
import {USER_NOT_WRITER} from "../response/error/auth";
import {ExceptionList} from "../response/error/errorInstances";
import {MailService} from "../mail/mail.service";
import {editorJsToHtml} from "../common";

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
        await this.postService.assertWriterOfPost(postId,user.id);
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
        ResponseMessage & {sentCount : number}, EMAIL_NOT_EXIST | POST_NOT_FOUND | FORBIDDEN_FOR_POST | NEWSLETTER_CATEGORY_NOT_FOUND | POST_CONTENT_NOT_FOUND | USER_NOT_WRITER>>{
        if(body.receiverEmails.length == 0 || body.receiverEmails.length > 5) throw ExceptionList.EMAIL_NOT_EXIST;
        await this.postService.assertWriterOfPost(postId,user.id);

        const postWithPostContent = await this.postService.getPostWithContentAndSeries(postId);
        if(postWithPostContent.post.category == null || postWithPostContent.post.category == "") throw ExceptionList.NEWSLETTER_CATEGORY_NOT_FOUND;
        const writer = await this.userService.getWriterInfoByUserId(user.id);

        await this.mailService.sendNewsLetterWithHtml({
            newsletterId: 0,
            emailList : body.receiverEmails,
            senderMailAddress : writer.writerInfo.moonjinId + "@" + process.env.MAILGUN_DOMAIN,
            senderName: user.nickname,
            subject: "[테스트 뉴스레터] "+postWithPostContent.post.title,
            html: editorJsToHtml(postWithPostContent.postContent)
        })

        return createResponseForm({
            message : 1 + "건의 테스트 뉴스레터를 발송했습니다.",
            sentCount : 1,
        });
    }

    /**
     * @summary 해당 유저의 뉴스레터 목록 가져오기
     * @param user
     * @param seriesOption
     * @returns NewsletterDto[]
     */
    @TypedRoute.Get()
    @UseGuards(UserAuthGuard)
    async getNewsletter(@User() user:UserAuthDto, @TypedQuery() seriesOption : IGetNewsletter) : Promise<Try<NewsletterDto[]>>{
        const newsletterList = await this.newsletterService.getNewsletterListByUserId(user.id, seriesOption.seriesOnly?? false);
        return createResponseForm(newsletterList);
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
}

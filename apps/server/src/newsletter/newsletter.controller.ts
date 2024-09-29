import {Controller, UseGuards} from '@nestjs/common';
import {TypedBody, TypedParam, TypedQuery, TypedRoute} from "@nestia/core";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {ISendNewsLetter} from "./api-types/ISendNewsLetter";
import {Try, TryCatch} from "../response/tryCatch";
import {
    FORBIDDEN_FOR_POST, NEWSLETTER_ALREADY_EXIST,
    NEWSLETTER_CATEGORY_NOT_FOUND,
    NEWSLETTER_NOT_FOUND,
    POST_CONTENT_NOT_FOUND,
    POST_NOT_FOUND
} from "../response/error/post";
import {createResponseForm, ResponseMessage} from "../response/responseForm";
import {NewsletterService} from "./newsletter.service";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {IGetNewsletter} from "./api-types/IGetNewsletter";
import {NewsletterAllDataDto, NewsletterCardDto, NewsletterLikeResponseDto, NewsletterSendResultDto} from "./dto";
import {ISendTesNewsletter} from "./api-types/ISendTestNewsletter";
import {USER_NOT_WRITER} from "../response/error/auth";
import {ExceptionList} from "../response/error/errorInstances";
import {MailService} from "../mail/mail.service";
import NewsletterDtoMapper from "./newsletterDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import {AssertEditorJsonDto, EditorJsToHtml} from "@moonjin/editorjs";
import PostDtoMapper from "../post/postDtoMapper";
import {GetPagination} from "../common/pagination/decorator/GetPagination.decorator";
import {PaginationOptionsDto} from "../common/pagination/dto";
import {IUpdateNewsletter} from "./api-types/IUpdateNewsletter";
import {WriterInfoDtoMapper} from "../writerInfo/writerInfoDtoMapper";
import {ICreateNewsLetterCuration} from "./api-types/ICreateNewsLetterCuration";
import {ISearchNewsletter} from "./api-types/ISearchNewsletter";
import {NewsletterWithPostWithWriterAndSeries} from "./prisma/NewsletterWithPostWithWriterAndSeries.prisma.type";

@Controller('newsletter')
export class NewsletterController {
    constructor(
        private readonly newsletterService: NewsletterService,
        private readonly mailService: MailService
    ) {}

    /**
     * @summary 최신 뉴스레터 리스트 가져오기
     * @param query
     * @param paginationOptions
     */
    @TypedRoute.Get("list")
    async getRecentNewsletterList(@TypedQuery() query : ISearchNewsletter,@GetPagination() paginationOptions : PaginationOptionsDto):Promise<Try<NewsletterCardDto[]>>{
        let newsletterList: NewsletterWithPostWithWriterAndSeries[];
        if(query.sort == "recent"){
            newsletterList = await this.newsletterService.getRecentNewsletterList(query.category,paginationOptions);
        }else{
            // TODO : 인기순 정렬 구현해야함
            newsletterList = await this.newsletterService.getRecentNewsletterList(query.category,paginationOptions);
        }
        const newsletterCardList = newsletterList.map(newsletter => {
            const { post, ...newsletterData} = newsletter;
            const {series,writerInfo, ...postData} = post;
            return {
                newsletter : NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
                post : PostDtoMapper.PostToPostDto(postData),
                series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterInfoInCardDto(writerInfo)
            }});
        return createResponseForm(newsletterCardList, {
            next : {
                pageNo : paginationOptions.pageNo + 1,
                cursor : newsletterCardList.length > 0 ? newsletterCardList[newsletterCardList.length - 1].newsletter.id : 0
            },
            isLastPage : newsletterCardList.length < paginationOptions.take,
            totalCount : newsletterCardList.length
        });

    }

    /**
     * @summary 뉴스레터 큐레이션 리스트 가져오기
     * @returns NewsletterCardDto[]
     * @throws NEWSLETTER_NOT_FOUND
     */
    @TypedRoute.Get("curation/weekly")
    async getNewsletterCurationList():Promise<TryCatch<NewsletterCardDto[], NEWSLETTER_NOT_FOUND>>{
        const newsletterList = await this.newsletterService.getNewsletterCurationList();
        return createResponseForm(newsletterList.map(newsletter => {
            const {post, ...newsletterData} = newsletter;
            const {series, writerInfo, ...postData} = post;
            return {
                newsletter: NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
                post: PostDtoMapper.PostToPostDto(postData),
                series: series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterInfoInCardDto(writerInfo)
            }
        }));
    }

    /**
     * @summary 뉴스레터 큐레이션 리스트 생성
     * @param body
     * @returns {createdNewsletterCurationNumber: number}
     * @throws NEWSLETTER_ALREADY_EXIST
     */
    @TypedRoute.Post("curation/weekly")
    async postNewsletterCurationList(@TypedBody() body : ICreateNewsLetterCuration):Promise<TryCatch<ResponseMessage & {createdNewsletterCurationCount: number}, NEWSLETTER_ALREADY_EXIST>>{
        const createdNewsletterCurationCount = await this.newsletterService.createNewsletterCuration(body.newsletterIdList.slice(0,10));
        return createResponseForm({message : createdNewsletterCurationCount + "개의 뉴스레터 큐레이션 리스트를 생성했습니다.",createdNewsletterCurationCount});
    }

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
    :Promise<TryCatch<NewsletterSendResultDto, POST_NOT_FOUND | FORBIDDEN_FOR_POST>> {
        const newsletter = await this.newsletterService.sendNewsLetter(postId,user.id ,body.newsletterTitle);
        const sentCount = newsletter.newsletterSend[0] ? newsletter.newsletterSend[0].mailNewsletter.length : 0;
        return createResponseForm({
            message : sentCount + "건의 뉴스레터를 발송했습니다.",
            sentCount,
            newsletterId : newsletter.id,
            newsletterSendId : newsletter.newsletterSend[0].id
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

        const postWithPostContentAndSeriesAndWriter = await this.newsletterService.assertNewsletterCanBeSent(user.id, postId);
        const postContent = postWithPostContentAndSeriesAndWriter.postContent.content;
        if(AssertEditorJsonDto(postContent) === false) throw ExceptionList.POST_CONTENT_NOT_FOUND; // TODO : 동작하는 지 테스트 필요

        await this.mailService.sendNewsLetterWithHtml({
            newsletterId: 0,
            emailList : body.receiverEmails,
            senderMailAddress : postWithPostContentAndSeriesAndWriter.writerInfo.moonjinId + "@" + process.env.MAILGUN_DOMAIN,
            senderName: user.nickname,
            subject: "[테스트 뉴스레터] "+postWithPostContentAndSeriesAndWriter.post.title,
            html: EditorJsToHtml(postContent, postWithPostContentAndSeriesAndWriter,0)
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
    @TypedRoute.Get('receive/all')
    @UseGuards(UserAuthGuard)
    async getAllReceivedNewsletter(@User() user:UserAuthDto, @TypedQuery() seriesOption : IGetNewsletter) : Promise<Try<NewsletterCardDto[]>>{
        const newsletterWithPostAndSeriesAndWriterList = await this.newsletterService.getReceivedNewsletterListByUserId(user.id, seriesOption.seriesOnly ?? false);
        return createResponseForm(newsletterWithPostAndSeriesAndWriterList.map(newsletterWithPostAndSeriesAndWriter => {
            const { post, ...newsletterData } = newsletterWithPostAndSeriesAndWriter.newsletter;
            const { writerInfo,series , ...postData } = post;
            return {
                newsletter : NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
                post : PostDtoMapper.PostToPostDto(postData),
                series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterInfoInCardDto(writerInfo)
            }
        }));
    }

    /**
     * @summary 해당 뉴스레터의 정보 가져오기
     * @param newsletterId
     * @returns NewsletterCardDto
     * @throws NEWSLETTER_NOT_FOUND
     */
    @TypedRoute.Get(':newsletterId')
    async getNewsletterById(@TypedParam("newsletterId") newsletterId: number) : Promise<TryCatch<NewsletterCardDto
    , NEWSLETTER_NOT_FOUND>>{
        const newsletterCard = await this.newsletterService.getNewsletterCardByNewsletterId(newsletterId);
        const {post, ...newsletterData} = newsletterCard;
        const {series, writerInfo, ...postData} = post;
        return createResponseForm({
            newsletter : NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
            post : PostDtoMapper.PostToPostDto(postData),
            series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
            writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterInfoInCardDto(writerInfo)
        });
    }

    /**
     * @summary 해당 유저가 보낸 뉴스레터 목록 가져오기
     * @param user
     * @returns SendNewsletterResultDto[]
     */
    @TypedRoute.Get('send/all')
    @UseGuards(WriterAuthGuard)
    async getSentNewsletter(@User() user:UserAuthDto) : Promise<Try<NewsletterCardDto[]>>{
        const newsletterList = await this.newsletterService.getSentNewsletterListByWriterId(user.id);
        const newsletterResultList = newsletterList.map(newsletter => {
            const { post, ...newsletterData} = newsletter;
            const {series,writerInfo, ...postData} = post;
            return {
                newsletter : NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
                post : PostDtoMapper.PostToPostDto(postData),
                series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterInfoInCardDto(writerInfo)
            }
        })

        return createResponseForm(newsletterResultList);
    }

    /**
     * @summary 해당 시리즈의 뉴스레터 목록 가져오기
     * @param seriesId
     */
    @TypedRoute.Get("in/series/:seriesId")
    @UseGuards(UserAuthGuard)
    async getNewsletterList(@TypedParam("seriesId") seriesId: number): Promise<Try<NewsletterCardDto[]>> {
        const newsletterList = await this.newsletterService.getNewsletterInSeriesBySeriesId(seriesId);
        const newsletterCardList = newsletterList.map(newsletter => {
            const { post, ...newsletterData} = newsletter;
            const {series,writerInfo, ...postData} = post;
            return {
                newsletter : NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
                post : PostDtoMapper.PostToPostDto(postData),
                series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterInfoInCardDto(writerInfo)
            }
        })
        return createResponseForm(newsletterCardList);
    }

    /**
     * @summary 해당 뉴스레터 좋아요
     * @param user
     * @param newsletterId
     * @returns {message: string}
     * @throws NEWSLETTER_NOT_FOUND
     */
    @TypedRoute.Post(':newsletterId/like')
    @UseGuards(UserAuthGuard)
    async likeNewsletter(@User() user:UserAuthDto, @TypedParam('newsletterId') newsletterId: number)
    :Promise<TryCatch<ResponseMessage, NEWSLETTER_NOT_FOUND>>{
        await this.newsletterService.likeNewsletter(newsletterId,user.id);
        return createResponseForm({message : "좋아요가 되었습니다."});
    }

    /**
     * @summary 해당 뉴스레터 좋아요 해제
     * @param user
     * @param newsletterId
     */
    @TypedRoute.Delete(':newsletterId/like')
    @UseGuards(UserAuthGuard)
    async unlikeNewsletter(@User() user:UserAuthDto, @TypedParam('newsletterId') newsletterId: number)
    :Promise<Try<ResponseMessage>>{
        await this.newsletterService.unlikeNewsletter( newsletterId, user.id);
        return createResponseForm({message : "좋아요가 해제 되었습니다."});
    }

    /**
     * @summary 해당 뉴스레터 좋아요 여부 확인
     * @param user
     * @param newsletterId
     */
    @TypedRoute.Get(':newsletterId/like')
    @UseGuards(UserAuthGuard)
    async getNewsletterLikeOrNot(@User() user:UserAuthDto, @TypedParam('newsletterId') newsletterId: number)
    :Promise<Try<NewsletterLikeResponseDto>> {
        try{
            const newsletterLike = await this.newsletterService.getNewsletterLike(user.id, newsletterId);
            return createResponseForm({like : true, createdAt:  newsletterLike.createdAt});
        }catch (error){
            return createResponseForm({like : false});
        }
    }

    /**
     * @summary 해당 뉴스레터와의 추천 연관글 가져오기
     * @param newsletterId
     * @param paginationOptions
     * @returns NewsletterCardDto[]
     * @throws NEWSLETTER_NOT_FOUND
     */
    @TypedRoute.Get(':newsletterId/recommend/all')
    async getRecommendNewsletterById(@TypedParam('newsletterId') newsletterId: number,  @GetPagination() paginationOptions: PaginationOptionsDto)
    :Promise<TryCatch<NewsletterCardDto[], NEWSLETTER_NOT_FOUND>>{
        const newsletter = await this.newsletterService.getNewsletterCardByNewsletterId(newsletterId);
        const recommendNewsletterList = await this.newsletterService.getRecommendNewsletterListByCategory(newsletter.post.category, paginationOptions);
        const recommendNewsletterCardList = recommendNewsletterList.map(newsletter => {
            const { post, ...newsletterData} = newsletter;
            const {series,writerInfo, ...postData} = post;
            return {
                newsletter : NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
                post : PostDtoMapper.PostToPostDto(postData),
                series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterInfoInCardDto(writerInfo)
            }});
        return createResponseForm(recommendNewsletterCardList, {
            next : {
                pageNo : paginationOptions.pageNo + 1,
                    cursor : recommendNewsletterCardList.length > 0 ? recommendNewsletterCardList[recommendNewsletterCardList.length - 1].newsletter.id : 0
            },
            isLastPage : recommendNewsletterCardList.length < paginationOptions.take,
                totalCount : recommendNewsletterCardList.length
        });
    }

    /**
     * @summary 뉴스레터 수정
     * @param user
     * @param newsletterId
     * @param body
     * @returns {message: string}
     * @throws NEWSLETTER_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     */
    @TypedRoute.Patch(':newsletterId')
    @UseGuards(WriterAuthGuard)
    async updateNewsletter(@User() user:UserAuthDto, @TypedParam('newsletterId') newsletterId: number, @TypedBody() body:IUpdateNewsletter)
    :Promise<TryCatch<ResponseMessage,NEWSLETTER_NOT_FOUND | FORBIDDEN_FOR_POST>>{
        await this.newsletterService.assertNewslettersWriter(newsletterId, user.id);
        await this.newsletterService.updateNewsletter(newsletterId, body);
        return createResponseForm({message : "뉴스레터가 수정되었습니다."});
    }

    /**
     * @summary 뉴스레터 삭제
     * @param user
     * @param newsletterId
     * @returns {message: string}
     * @throws NEWSLETTER_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     */
    @TypedRoute.Delete(':newsletterId')
    @UseGuards(WriterAuthGuard)
    async deleteNewsletter(@User() user:UserAuthDto, @TypedParam('newsletterId') newsletterId: number)
    :Promise<TryCatch<ResponseMessage, NEWSLETTER_NOT_FOUND | FORBIDDEN_FOR_POST>>{
        await this.newsletterService.assertNewslettersWriter(newsletterId, user.id);
        await this.newsletterService.deleteNewsletter(newsletterId);
        return createResponseForm({message : "뉴스레터가 삭제되었습니다."});
    }

    /**
     * @summary 해당 뉴스레터의 전체 정보 가져오기 (작성자 전용)
     * @param user
     * @param newsletterId
     * @returns NewsletterAllDataDto
     * @throws NEWSLETTER_NOT_FOUND
     * @throws FORBIDDEN_FOR_POST
     */
    @TypedRoute.Get(":newsletterId/all")
    @UseGuards(WriterAuthGuard)
    async getNewsletterAll(@User() user:UserAuthDto, @TypedParam('newsletterId') newsletterId: number)
    :Promise<TryCatch<NewsletterAllDataDto, NEWSLETTER_NOT_FOUND | FORBIDDEN_FOR_POST>>{
        const newsletter = await this.newsletterService.getNewsletterAllDataById(newsletterId);
        if(newsletter.post.writerInfo.userId !== user.id) throw ExceptionList.FORBIDDEN_FOR_POST;

        const { post, postContent,...newsletterData} = newsletter;
        const {series,writerInfo, ...postData} = post;
        return createResponseForm({
            newsletter: NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
            post: PostDtoMapper.PostToPostDto(postData),
            postContent: PostDtoMapper.PostContentToPostContentDto(postContent),
            series: series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
            writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterProfileDto(writerInfo)
        })
    }
}
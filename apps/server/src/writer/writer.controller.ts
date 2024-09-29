import {Controller} from '@nestjs/common';
import {TypedBody, TypedParam, TypedQuery, TypedRoute} from "@nestia/core";
import {WriterInfoService} from "../writerInfo/writerInfo.service";
import {createResponseForm, ResponseMessage} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {WriterProfileDto} from "../writerInfo/dto";
import {USER_NOT_WRITER} from "@moonjin/api-types";
import {GetPagination} from "../common/pagination/decorator/GetPagination.decorator";
import {PaginationOptionsDto} from "../common/pagination/dto";
import {NewsletterService} from "../newsletter/newsletter.service";
import NewsletterDtoMapper from "../newsletter/newsletterDtoMapper";
import PostDtoMapper from "../post/postDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import {NewsletterAllDataDto, NewsletterCardDto} from "../newsletter/dto";
import {IGetNewsletterByWriter} from "./api-types/IGetNewsletterByWriter";
import {SeriesService} from "../series/series.service";
import {SeriesDto} from "../series/dto";
import {FORBIDDEN_FOR_SERIES, SERIES_NOT_FOUND} from "../response/error/series";
import {ExceptionList} from "../response/error/errorInstances";
import {ICreateExternalSubscriber} from "../subscribe/api-types/ICreateExternalSubscriber";
import {SubscribeService} from "../subscribe/subscribe.service";
import {SUBSCRIBE_ALREADY_ERROR} from "../response/error/subscribe";
import {EMAIL_ALREADY_EXIST} from "../response/error/auth";
import {NEWSLETTER_NOT_FOUND} from "../response/error/post";
import {WriterInfoDtoMapper} from "../writerInfo/writerInfoDtoMapper";
import {WriterService} from "./writer.service";

@Controller('writer')
export class WriterController {
    constructor(
        private readonly writerInfoService: WriterInfoService,
        private readonly newsletterService: NewsletterService,
        private readonly seriesService: SeriesService,
        private readonly subscribeService: SubscribeService,
        private readonly writerService:WriterService
    ) {}


    /**
     * @summary 작가의 public Profile 데이터 가져오기
     */
    @TypedRoute.Get(":moonjinId/info/public")
    async getWriterPublicInfo(@TypedParam("moonjinId") moonjinId : string) : Promise<TryCatch<WriterProfileDto,
        USER_NOT_WRITER >>{
        const writerPublicInfo = await this.writerInfoService.getWriterPublicCardByMoonjinId(moonjinId);
        return createResponseForm(writerPublicInfo)
    }

    /**
     * @summary 작가페이지에서 외부 구독자 폼 구독하기
     * @param moonjinId
     * @param body
     */
    @TypedRoute.Post(":moonjinId/subscribe/external")
    async getWriterSubscribeForm(@TypedParam("moonjinId") moonjinId : string, @TypedBody() body : ICreateExternalSubscriber):Promise<TryCatch<ResponseMessage,
        USER_NOT_WRITER | EMAIL_ALREADY_EXIST | SUBSCRIBE_ALREADY_ERROR>> {
        await this.subscribeService.addExternalSubscriberByMoonjinId(moonjinId, body);
        return createResponseForm({message: "구독 신청되었습니다."})
    }

    /**
     * @summary 작가의 Newsletter 가져오기 (w pagination)
     */
    @TypedRoute.Get(":moonjinId/newsletter")
    async getNewsletterListByMoonjinId(@TypedParam("moonjinId") moonjinId : string, @TypedQuery() query: IGetNewsletterByWriter, @GetPagination() paginationOptions: PaginationOptionsDto):
        Promise<Try<NewsletterCardDto[]>>{
        let newsletterList;
        if(query.newsletterType === "all"){
            newsletterList = await this.newsletterService.getAllSentNewsletterListByMoonjinId(moonjinId,paginationOptions);
        }else{
            newsletterList = await this.newsletterService.getAllSentNormalNewsletterListByMoonjinId(moonjinId,paginationOptions);
        }
        const newsletterCardList= newsletterList.map(newsletterWithPostAndSeriesAndWriter => {
            const { post, ...newsletterData } = newsletterWithPostAndSeriesAndWriter;
            const { writerInfo, series , ...postData } = post;
            return {
                newsletter : NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
                post : PostDtoMapper.PostToPostDto(postData),
                series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterInfoInCardDto(writerInfo)
            }
        })
        return createResponseForm(newsletterCardList, {
                next : {
                    pageNo : paginationOptions.pageNo + 1,
                    cursor : newsletterCardList.length > 0 ? newsletterCardList[newsletterCardList.length - 1].newsletter.id : 0
                },
                isLastPage : newsletterCardList.length < paginationOptions.take,
                totalCount : newsletterCardList.length
            }
        );
    }

    /**
     * @summary 작가의 Series 가져오기 (w pagination)
     */
    @TypedRoute.Get(":moonjinId/series")
    async getSeriesListByMoonjinId(@TypedParam("moonjinId") moonjinId : string,  @GetPagination() paginationOptions: PaginationOptionsDto)
        : Promise<Try<SeriesDto[]>>{
        const seriesList = await this.seriesService.getSeriesByMoonjinId(moonjinId, paginationOptions);
        const seriesCardList = seriesList.map(series => SeriesDtoMapper.SeriesToSeriesDto(series));
        return createResponseForm(seriesCardList,{
            next : {
                pageNo : paginationOptions.pageNo + 1,
                cursor : seriesCardList.length > 0 ? seriesCardList[seriesCardList.length - 1].id : 0
            },
            isLastPage : seriesCardList.length < paginationOptions.take,
            totalCount : seriesCardList.length
        });
    }

    /**
     * @summary 작가페이지의 시리즈 데이터 가져오기
     * @param moonjinId
     * @param seriesId
     * @returns SeriesDto
     * @throws SERIES_NOT_FOUND
     */
    @TypedRoute.Get(":moonjinId/series/:seriesId")
    async getSeriesDataBySeriesId(@TypedParam("moonjinId") moonjinId : string, @TypedParam("seriesId") seriesId : number)
        : Promise<TryCatch<SeriesDto, SERIES_NOT_FOUND>>{
        const series = await this.seriesService.getSeriesByMoonjinIdAndSeriesId(moonjinId,seriesId);
        return createResponseForm(SeriesDtoMapper.SeriesToSeriesDto(series));
    }

    /**
     * @summary 작가페이지의 시리즈에 속한 newsletter들 가져오기
     * @param moonjinId
     * @param seriesId
     * @param paginationOptions
     * @returns NewsletterCardDto[]
     * @throws FORBIDDEN_FOR_SERIES
     */
    @TypedRoute.Get(":moonjinId/series/:seriesId/newsletter")
    async getSeriesNewsletterListBySeriesId(@TypedParam("moonjinId") moonjinId : string, @TypedParam("seriesId") seriesId : number, @GetPagination() paginationOptions: PaginationOptionsDto)
        : Promise<TryCatch<NewsletterCardDto[], FORBIDDEN_FOR_SERIES>>{
        const newsletterWithPostWithWriterAndSeries = await this.newsletterService.getNewsletterInSeriesBySeriesId(seriesId, paginationOptions);
        if(newsletterWithPostWithWriterAndSeries.length > 0 && newsletterWithPostWithWriterAndSeries[0].post.writerInfo.moonjinId !== moonjinId)
            throw ExceptionList.FORBIDDEN_FOR_SERIES
        return createResponseForm(newsletterWithPostWithWriterAndSeries.map(newsletterWithPostAndSeriesAndWriter => {
            const {post, ...newsletterData} = newsletterWithPostAndSeriesAndWriter;
            const {writerInfo, series, ...postData} = post;
            return {
                newsletter: NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
                post: PostDtoMapper.PostToPostDto(postData),
                series: series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer: WriterInfoDtoMapper.WriterInfoWithUserToWriterInfoInCardDto(writerInfo)
            }
        }), {
            next: {
                pageNo: paginationOptions.pageNo + 1,
                cursor: newsletterWithPostWithWriterAndSeries.length > 0 ? newsletterWithPostWithWriterAndSeries[newsletterWithPostWithWriterAndSeries.length - 1].id : 0
            },
            isLastPage: newsletterWithPostWithWriterAndSeries.length < paginationOptions.take,
            totalCount: newsletterWithPostWithWriterAndSeries.length
        })
    }

    /**
     * @summary 작가페이지의 newsletter 의 모든 데이터 가져오기
     * @param moonjinId
     * @param newsletterId
     * @returns NewsletterAllDataDto
     * @throws NEWSLETTER_NOT_FOUND
     */
    @TypedRoute.Get(":moonjinId/newsletter/:newsletterId")
    async getNewsletterAllDataByNewsletterId(@TypedParam("moonjinId") moonjinId : string, @TypedParam("newsletterId") newsletterId : number)
    :Promise<TryCatch<NewsletterAllDataDto, NEWSLETTER_NOT_FOUND>>{
        const newsletterWithPostWithWriterAndSeries = await this.newsletterService.getNewsletterAllDataById(newsletterId);
        if(newsletterWithPostWithWriterAndSeries.post.writerInfo.moonjinId !== moonjinId)
            throw ExceptionList.NEWSLETTER_NOT_FOUND

        const {post, postContent,...newsletterData} = newsletterWithPostWithWriterAndSeries;
        const {writerInfo, series, ...postData} = post;
        return createResponseForm({
            newsletter: NewsletterDtoMapper.newsletterToNewsletterDto(newsletterData),
            post: PostDtoMapper.PostToPostDto(postData),
            postContent: PostDtoMapper.PostContentToPostContentDto(postContent),
            series: series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
            writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterProfileDto(writerInfo)
        })
    }

    /**
     * @summary 인기 작가 조회
     * @returns WriterProfileDto[]
     */
    @TypedRoute.Get("popular")
    async getPopularWriters(@GetPagination() paginationOptions: PaginationOptionsDto) : Promise<Try<WriterProfileDto[]>>{
        const writerList = await this.writerService.getPopularWriters(paginationOptions.take);
        const popularWriterList = writerList.map(writer => WriterInfoDtoMapper.WriterInfoWithUserToWriterProfileDto(writer));
        return createResponseForm(popularWriterList, {
            next: {
                pageNo: paginationOptions.pageNo + 1,
                cursor: popularWriterList.length > 0 ? popularWriterList[popularWriterList.length - 1].writerInfo.userId : 0
            },
            isLastPage: popularWriterList.length < paginationOptions.take,
            totalCount: popularWriterList.length
        });
    }
}

import {Controller} from '@nestjs/common';
import {TypedParam, TypedQuery, TypedRoute} from "@nestia/core";
import {WriterInfoService} from "../writerInfo/writerInfo.service";
import {createResponseForm} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {WriterProfileDto} from "../writerInfo/dto";
import {USER_NOT_WRITER} from "@moonjin/api-types";
import {GetPagination} from "../common/pagination/decorator/GetPagination.decorator";
import {PaginationOptionsDto} from "../common/pagination/dto";
import {NewsletterService} from "../newsletter/newsletter.service";
import NewsletterDtoMapper from "../newsletter/newsletterDtoMapper";
import PostDtoMapper from "../post/postDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import {NewsletterCardDto} from "../newsletter/dto";
import {IGetNewsletterByWriter} from "./api-types/IGetNewsletterByWriter";
import {SeriesService} from "../series/series.service";
import {SeriesDto} from "../series/dto";

@Controller('writer')
export class WriterController {
    constructor(
        private readonly writerInfoService: WriterInfoService,
        private readonly newsletterService: NewsletterService,
        private readonly seriesService: SeriesService,
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
                newsletter : NewsletterDtoMapper.newsletterToNewsletterSummaryDto(newsletterData),
                post : PostDtoMapper.PostToPostInNewsletterCardDto(postData),
                series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
                writer : {
                    userId : writerInfo.userId,
                    moonjinId : writerInfo.moonjinId,
                    nickname : writerInfo.user.nickname
                },
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

}

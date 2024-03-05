import { Controller, UseGuards } from '@nestjs/common';
import {TypedBody, TypedParam, TypedRoute} from "@nestia/core";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto/userAuthDto";
import {ICreateSeries} from "./api-types/ICreateSeries";
import {SeriesService} from "./series.service";
import {createResponseForm} from "../response/responseForm";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {SeriesWithWriterDto} from "./dto/seriesWithWriter.dto";
import {Try, TryCatch} from "../response/tryCatch";
import {SeriesDto} from "./dto/series.dto";
import {USER_NOT_WRITER} from "../response/error/auth";
import {IUpdateSeries} from "./api-types/IUpdateSeries";
import {SERIES_NOT_FOUND} from "../response/error/series";

@Controller('series')
export class SeriesController {
    constructor(
        private readonly seriesService: SeriesService
    ) {}

    /**
     * @summary 시리즈 생성 API
     */
    @TypedRoute.Post()
    @UseGuards(WriterAuthGuard)
    async createSeries(
        @User() user :UserAuthDto,
        @TypedBody() seriesData : ICreateSeries
    ){
        const series = await this.seriesService.createSeries({writerId: user.id,...seriesData});
        return createResponseForm(series)
    }

    /**
     * @summary 구독 중인 시리즈 가져오기
     * @param user
     * @returns series
     */
    @TypedRoute.Get('following')
    @UseGuards(UserAuthGuard)
    async getSeries(@User() user: UserAuthDto) : Promise<Try<SeriesWithWriterDto[]>>{
        const seriesList = await this.seriesService.getSeriesByUserId(user.id);
        return createResponseForm(seriesList)
    }

    /**
     * @summary 내가 발행한 시리즈 가져오기
     * @param user
     * @returns series[]
     * @throws USER_NOT_WRITER
     */
    @TypedRoute.Get('me')
    @UseGuards(WriterAuthGuard)
    async getSeriesByWriter(@User() user: UserAuthDto) : Promise<TryCatch<SeriesDto[], USER_NOT_WRITER>>{
        const seriesList = await this.seriesService.getSeriesListByWriterId(user.id);
        return createResponseForm(seriesList)
    }

    /**
     * @summary 시리즈 수정 API
     * @param user
     * @param seriesId
     * @param seriesData
     * @returns series
     * @throws USER_NOT_WRITER
     * @throws SERIES_NOT_FOUND
     */
    @TypedRoute.Patch(':seriesId')
    @UseGuards(WriterAuthGuard)
    async updateSeries(
        @User() user :UserAuthDto,
        @TypedParam('seriesId') seriesId: number,
        @TypedBody() seriesData : IUpdateSeries
    ): Promise<TryCatch<SeriesDto, USER_NOT_WRITER | SERIES_NOT_FOUND>>{
        const series = await this.seriesService.updateSeries(seriesId,user.id,seriesData);
        return createResponseForm(series);
    }

}

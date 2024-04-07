import { Controller, UseGuards } from '@nestjs/common';
import {TypedBody, TypedParam, TypedRoute} from "@nestia/core";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto";
import {ICreateSeries} from "./api-types/ICreateSeries";
import {SeriesService} from "./series.service";
import {createResponseForm} from "../response/responseForm";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {ReleasedSeriesDto, ReleasedSeriesWithWriterDto, SeriesDto} from "./dto";
import {Try, TryCatch} from "../response/tryCatch";
import {USER_NOT_WRITER} from "../response/error/auth";
import {IUpdateSeries} from "./api-types/IUpdateSeries";
import {CREATE_SERIES_ERROR, FORBIDDEN_FOR_SERIES, SERIES_NOT_FOUND} from "../response/error/series";
import {UserService} from "../user/user.service";

@Controller('series')
export class SeriesController {
    constructor(
        private readonly seriesService: SeriesService,
        private readonly userSerivce:UserService
    ) {}

    /**
     * @summary 시리즈 생성 API
     * @param user
     * @param seriesData
     * @returns SeriesDto
     * @throws CREATE_SERIES_ERROR
     */
    @TypedRoute.Post()
    @UseGuards(WriterAuthGuard)
    async createSeries(
        @User() user :UserAuthDto,
        @TypedBody() seriesData : ICreateSeries
    ): Promise<TryCatch<SeriesDto, CREATE_SERIES_ERROR >>{
        const series = await this.seriesService.createSeries({writerId: user.id,...seriesData});
        if(series.status) await this.userSerivce.synchronizeSeries(user.id, true);
        return createResponseForm(series)
    }

    /**
     * @summary 구독 중인 시리즈 가져오기
     * @param user
     * @returns ReleasedSeriesWithWriterDto[]
     */
    @TypedRoute.Get('following')
    @UseGuards(UserAuthGuard)
    async getSeries(@User() user: UserAuthDto) : Promise<Try<ReleasedSeriesWithWriterDto[]>>{
        const seriesList = await this.seriesService.getFollowingSeriesByFollowerId(user.id);
        return createResponseForm(seriesList)
    }

    /**
     * @summary 내가 작성중인 시리즈 id로 가져오기
     * @param user
     * @param seriesId
     * @returns ReleasedSeriesDto[]
     */
    @TypedRoute.Get('writing/:seriesId')
    @UseGuards(WriterAuthGuard)
    async getWritingSeriesById(@User() user: UserAuthDto, @TypedParam('seriesId') seriesId : number) : Promise<TryCatch<
        SeriesDto, SERIES_NOT_FOUND | FORBIDDEN_FOR_SERIES>>{
        const seriesList = await this.seriesService.getWritingSeriesById(seriesId,user.id);
        return createResponseForm(seriesList)
    }

    /**
     * @summary 내가 발행한 시리즈들 가져오기
     * @param user
     * @returns ReleasedSeriesDto[]
     */
    @TypedRoute.Get('me')
    @UseGuards(WriterAuthGuard)
    async getReleasedSeriesByWriter(@User() user: UserAuthDto) : Promise<Try<ReleasedSeriesDto[]>>{
        const seriesList = await this.seriesService.getReleasedSeriesListByWriterId(user.id);
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

    /**
     * @summary 시리즈 상세 정보 가져오기
     * @param seriesId
     * @returns ReleasedSeriesDto
     * @throws SERIES_NOT_FOUND
     * @throws FORBIDDEN_FOR_SERIES
     */
    @TypedRoute.Get(':seriesId')
    @UseGuards(UserAuthGuard)
    async getReleasedSeriesById(@TypedParam('seriesId') seriesId: number) :
        Promise<TryCatch<ReleasedSeriesDto, SERIES_NOT_FOUND | FORBIDDEN_FOR_SERIES>>{
        const series = await this.seriesService.getReleasedSeriesById(seriesId);
        return createResponseForm(series);
    }
}

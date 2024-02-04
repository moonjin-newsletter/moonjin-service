import { Controller, UseGuards } from '@nestjs/common';
import {TypedBody, TypedRoute} from "@nestia/core";
import {User} from "../auth/decorator/user.decorator";
import {UserAuthDto} from "../auth/dto/userAuthDto";
import {ICreateSeries} from "./api-types/ICreateSeries";
import {SeriesService} from "./series.service";
import {createResponseForm} from "../response/responseForm";
import {WriterAuthGuard} from "../auth/guard/writerAuth.guard";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {SeriesWithWriterDto} from "./dto/seriesWithWriter.dto";
import {Try} from "../response/tryCatch";

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
    @TypedRoute.Get('/following')
    @UseGuards(UserAuthGuard)
    async getSeries(@User() user: UserAuthDto) : Promise<Try<SeriesWithWriterDto[]>>{
        const seriesList = await this.seriesService.getSeriesByUserId(user.id);
        return createResponseForm(seriesList)
    }

}

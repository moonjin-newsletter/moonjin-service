import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {UtilService} from "../util/util.service";
import SeriesDtoMapper from "./seriesDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import {SeriesDto, CreateSeriesDto, ReleasedSeriesWithWriterDto, ReleasedSeriesDto, UnreleasedSeriesDto} from "./dto";
import {IUpdateSeries} from "./api-types/IUpdateSeries";
import {FollowingSeriesAndWriter} from "./prisma/followingSeriesAndWriter.prisma.type";

@Injectable()
export class SeriesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
    ) {}

    async createSeries(createSeriesData : CreateSeriesDto) : Promise<SeriesDto>{
        const createdAt = this.utilService.getCurrentDateInKorea();
        try {
            const releaseDate = createSeriesData.releasedAt ? createSeriesData.releasedAt: this.utilService.getCurrentDateInKorea();
            const createdSeries = await this.prismaService.series.create({
                data: {
                    ...createSeriesData,
                    createdAt,
                    lastUpdatedAt :createdAt,
                    releasedAt : (createSeriesData.status) ? releaseDate : null
                }
            })
            return SeriesDtoMapper.SeriesToSeriesDto(createdSeries);
        }catch (error){
            console.error(error);
            throw ExceptionList.CREATE_SERIES_ERROR;
        }
    }

    /**
     * @summary 해당 유저의 구독 중인 시리즈 가져오기
     * @param followerId
     */
    async getFollowingSeriesByFollowerId(followerId : number) : Promise<ReleasedSeriesWithWriterDto[]>{
        const followingSeriesList : FollowingSeriesAndWriter[] = await this.prismaService.follow.findMany({
            where:{
                followerId,
            },
            include : {
                writerInfo: {
                    include: {
                        series: {
                            where: {
                                deleted: false,
                                releasedAt:{
                                    not : null
                                }
                            }
                        },
                        user: true
                    }
                }
            }
        })
        if(!followingSeriesList) return [];
        return SeriesDtoMapper.FollowingSeriesAndWriterListToSeriesWithWriterDtoList(followingSeriesList);
    }

    /**
     * @summary 시리즈 존재 여부 확인
     * @param seriesId
     * @throws SERIES_NOT_FOUND
     */
    async assertSeriesExist(seriesId : number) : Promise<void>{
        const series = await this.prismaService.series.findUnique({
            where:{
                id : seriesId,
                deleted : false
            }
        })
        if(!series) throw ExceptionList.SERIES_NOT_FOUND;
    }

    /**
     * @summary 해당 작가의 시리즈 가져오기
     * @param writerId
     * @returns ReleasedSeriesDto[]
     */
    async getReleasedSeriesListByWriterId(writerId: number): Promise<ReleasedSeriesDto[]> {
        try {
            const seriesList = await this.prismaService.series.findMany({
                where: {
                    deleted: false,
                    writerId: writerId,
                    releasedAt: {
                        not: null
                    }
                }
            })
            return SeriesDtoMapper.SeriesListToReleasedSeriesDtoList(seriesList);
        }catch(error){
            console.error(error);
            return [];
        }
    }

    /**
     * @summary 해당 작가의 시리즈가 맞는 지 확인
     * @param seriesId
     * @param writerId
     * @throws SERIES_NOT_FOUND
     * @throws USER_NOT_WRITER
     */
    async assertWriterOfSeries(seriesId: number, writerId: number): Promise<void> {
        const series = await this.prismaService.series.findUnique({
            where: {
                id: seriesId
            },
            select: {
                writerId: true
            }
        });
        if(!series) throw ExceptionList.SERIES_NOT_FOUND;
        if (series.writerId !== writerId) throw ExceptionList.USER_NOT_WRITER;
    }

    /**
     * @summary 시리즈 수정
     * @param seriesId
     * @param writerId
     * @param seriesData
     * @returns ReleasedSeriesDto | UnreleasedSeriesDto
     * @throws SERIES_NOT_FOUND
     * @throws USER_NOT_WRITER
     */
    async updateSeries(seriesId: number, writerId: number, seriesData: IUpdateSeries): Promise<ReleasedSeriesDto | UnreleasedSeriesDto> {
        await this.assertWriterOfSeries(seriesId, writerId);
        try {
            const updatedSeries = await this.prismaService.series.update({
                where: {
                    id: seriesId
                },
                data: {
                    ...seriesData
                }
            })
            if(updatedSeries.releasedAt) return SeriesDtoMapper.SeriesToReleasedSeriesDto(updatedSeries, updatedSeries.releasedAt);
            else return SeriesDtoMapper.SeriesToUnreleasedSeriesDto(updatedSeries);
        }catch (error){
            console.error(error);
            throw ExceptionList.SERIES_NOT_FOUND;
        }
    }


}

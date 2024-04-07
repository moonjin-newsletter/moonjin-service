import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {UtilService} from "../util/util.service";
import SeriesDtoMapper from "./seriesDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import {SeriesDto, CreateSeriesDto, SeriesWithWriterDto} from "./dto";
import {IUpdateSeries} from "./api-types/IUpdateSeries";
import {FollowingSeriesAndWriter} from "./prisma/followingSeriesAndWriter.prisma.type";

@Injectable()
export class SeriesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
    ) {}

    /**
     * @summary 시리즈 생성
     * @param createSeriesData
     * @returns SeriesDto
     * @throws CREATE_SERIES_ERROR
     */
    async createSeries(createSeriesData : CreateSeriesDto) : Promise<SeriesDto>{
        const createdAt = this.utilService.getCurrentDateInKorea();
        const cover = this.utilService.processImageForCover(createSeriesData.cover);
        try {
            const createdSeries = await this.prismaService.series.create({
                data: {
                    ...createSeriesData,
                    cover,
                    createdAt,
                    lastUpdatedAt :createdAt,
                }
            })
            return SeriesDtoMapper.SeriesToSeriesDto(createdSeries);
        } catch (error){
            console.error(error);
            throw ExceptionList.CREATE_SERIES_ERROR;
        }
    }

    /**
     * @summary 해당 유저의 구독 중인 시리즈 가져오기
     * @param followerId
     */
    async getFollowingSeriesByFollowerId(followerId : number) : Promise<SeriesWithWriterDto[]>{
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
                            }
                        },
                        user: true
                    }
                }
            }
        })
        if(!followingSeriesList) return [];
        return followingSeriesList.map(followingSeries => SeriesDtoMapper.FollowingSeriesAndWriterToSeriesWithWriterDto(followingSeries));
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
     * @returns SeriesDto[]
     */
    async getReleasedSeriesListByWriterId(writerId: number): Promise<SeriesDto[]> {
        try {
            const seriesList = await this.prismaService.series.findMany({
                where: {
                    deleted: false,
                    writerId: writerId,
                }
            })
            return seriesList.map(series => SeriesDtoMapper.SeriesToSeriesDto(series));
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
    async updateSeries(seriesId: number, writerId: number, seriesData: IUpdateSeries): Promise<SeriesDto> {
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
            return SeriesDtoMapper.SeriesToSeriesDto(updatedSeries);
        }catch (error){
            console.error(error);
            throw ExceptionList.SERIES_NOT_FOUND;
        }
    }

    /**
     * @summary 해당 유저가 해당 글에 접근할 수 있는 지 권한 확인
     * @param seriesId
     * @param userId
     * @throws SERIES_NOT_FOUND
     * @throws FORBIDDEN_FOR_SERIES
     */
    async assertUserCanAccessToSeries(seriesId: number, userId: number) {
        const series = await this.prismaService.series.findUnique({
            where : {
                id : seriesId
            },
            select : {
                writerId : true
            }
        })
        if(!series) throw ExceptionList.SERIES_NOT_FOUND;
        if(series.writerId === userId) return;

        const follower = await this.prismaService.follow.findUnique({
            where : {
                followerId_writerId: {
                    followerId : userId,
                    writerId : series.writerId
                }
            }
        })
        if(!follower) throw ExceptionList.FORBIDDEN_FOR_SERIES;
    }

    /**
     * @summary 해당 시리즈 정보 id로 가져오기
     * @param seriesId
     * @returns SeriesDto
     * @throws SERIES_NOT_FOUND
     * @throws FORBIDDEN_FOR_SERIES
     */
    async getReleasedSeriesById(seriesId: number): Promise<SeriesDto> {
        const series = await this.prismaService.series.findUnique({
            where: {
                id: seriesId
            }
        });
        if(!series) throw ExceptionList.SERIES_NOT_FOUND;
        if(!series.status) throw ExceptionList.FORBIDDEN_FOR_SERIES;
        return SeriesDtoMapper.SeriesToSeriesDto(series);
    }

    /**
     * @summary 나의 시리즈 정보 id로 가져오기
     * @param seriesId
     * @param userId
     * @returns SeriesDto
     * @throws SERIES_NOT_FOUND
     * @throws FORBIDDEN_FOR_SERIES
     */
    async getWritingSeriesById(seriesId: number, userId : number ): Promise<SeriesDto> {
        await this.assertUserCanAccessToSeries(seriesId, userId);
        const series = await this.prismaService.series.findUnique({
            where: {
                id: seriesId
            }
        });
        if(!series) throw ExceptionList.SERIES_NOT_FOUND;
        return SeriesDtoMapper.SeriesToSeriesDto(series);
    }
}

import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {UtilService} from "../util/util.service";
import SeriesDtoMapper from "./seriesDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import {SeriesDto, CreateSeriesDto, SeriesWithWriterDto} from "./dto";
import {IUpdateSeries} from "./api-types/IUpdateSeries";
import { FollowingSeriesWithWriter,
} from "./prisma/followingSeriesAndWriter.prisma.type";
import UserDtoMapper from "../user/userDtoMapper";
import {SubscribeService} from "../subscribe/subscribe.service";
import {PaginationOptionsDto} from "../common/pagination/dto";
import {Series} from "@prisma/client";
import {Category} from "@moonjin/api-types";

@Injectable()
export class SeriesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly subscribeService: SubscribeService
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
                    category : Category.getNumberByCategory(createSeriesData.category),
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
        try{
            const followingWriterList = await this.subscribeService.getSubscribingWriterListBySubscriberId(followerId);
            if(followingWriterList.length === 0) return [];
            const followingWriterIdList= followingWriterList.map(writer => writer.user.id);
            const followingSeriesWithWriterList : FollowingSeriesWithWriter[] = await this.prismaService.series.findMany({
                where: {
                    deleted: false,
                    writerId: {
                        in: followingWriterIdList
                    }
                },
                include: {
                    writerInfo: {
                        include: {
                            user: true
                        }
                    }
                }
            })
            if(followingSeriesWithWriterList.length === 0) return [];
            return followingSeriesWithWriterList.map(seriesWithWriter => {
                const { writerInfo, ...series} = seriesWithWriter
                return {
                    series: SeriesDtoMapper.SeriesToSeriesDto(series),
                    writer: UserDtoMapper.UserToUserProfileDto(writerInfo.user)
                }
            })
        }catch (error){
            return [];
        }

    }

    /**
     * @summary 시리즈 존재 여부 확인
     * @param seriesId
     * @throws SERIES_NOT_FOUND
     */
    async assertSeriesExist(seriesId : number) : Promise<SeriesDto>{
        const series = await this.prismaService.series.findUnique({
            where:{
                id : seriesId,
                deleted : false
            }
        })
        if(!series) throw ExceptionList.SERIES_NOT_FOUND;
        return SeriesDtoMapper.SeriesToSeriesDto(series);
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
                },
                orderBy:{
                    createdAt: 'desc'
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
                    ...seriesData,
                    category: Category.getNumberByCategory(seriesData.category),
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

        const follower = await this.prismaService.subscribe.findUnique({
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
                id: seriesId,
                deleted: false
            }
        });
        if(!series) throw ExceptionList.SERIES_NOT_FOUND;
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

    /**
     * @summary 시리즈에 권한이 있는지 확인
     * @param seriesId
     * @param userId
     * @throws SERIES_NOT_FOUND
     * @throws FORBIDDEN_FOR_SERIES
     */
    async assertSeriesOwner(seriesId: number, userId: number) {
        const series = await this.prismaService.series.findUnique({
            where: {
                id: seriesId
            },
            select: {
                writerId: true
            }
        });
        if(!series) throw ExceptionList.SERIES_NOT_FOUND;
        if(series.writerId !== userId) throw ExceptionList.FORBIDDEN_FOR_SERIES;
    }

    /**
     * @summary 시리즈가 비어있는 지 확인
     * @param seriesId
     * @throws SERIES_NOT_EMPTY
     */
    async assertSeriesEmpty(seriesId : number): Promise<void>{
        const postsWithSeries = await this.prismaService.post.findMany({
            where:{
                seriesId,
                deleted : false
            },
        })
        if(postsWithSeries.length > 0) throw ExceptionList.SERIES_NOT_EMPTY;
    }

    /**
     * @summary 시리즈 삭제
     * @param seriesId
     * @throws SERIES_NOT_FOUND
     */
    async deleteSeries(seriesId: number): Promise<void> {
        try{
            await this.prismaService.series.update({
                where: {
                    id: seriesId
                },
                data: {
                    deleted: true
                }
            })
        }catch (error){
            throw ExceptionList.SERIES_NOT_FOUND;
        }

    }

    /**
     * @summary 해당 작가의 시리즈 가져오기 (by moonjinId)
     * @param moonjinId
     * @param paginationOption
     */
    async getSeriesByMoonjinId(moonjinId: string, paginationOption : PaginationOptionsDto):Promise<Series[]>{
        return this.prismaService.series.findMany({
            where: {
                writerInfo: {
                    moonjinId
                },
                deleted: false
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: paginationOption.skip,
            take: paginationOption.take,
            cursor : paginationOption.cursor ? {
                id : paginationOption.cursor
            } : undefined
        });

    }
}

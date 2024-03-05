import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateSeriesDto} from "./dto/createSeries.dto";
import {UtilService} from "../util/util.service";
import SeriesDtoMapper from "./seriesDtoMapper";
import {SeriesDto} from "./dto/series.dto";
import {ExceptionList} from "../response/error/errorInstances";
import {UserService} from "../user/user.service";
import {SeriesWithWriterDto} from "./dto/seriesWithWriter.dto";
import {AuthValidationService} from "../auth/auth.validation.service";
import {IUpdateSeries} from "./api-types/IUpdateSeries";

@Injectable()
export class SeriesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly userService: UserService,
        private readonly authValidationService: AuthValidationService
    ) {}

    async createSeries(createSeriesData : CreateSeriesDto) : Promise<SeriesDto>{
        try {
            const releaseDate = createSeriesData.releasedAt ? createSeriesData.releasedAt: this.utilService.getCurrentDateInKorea();
            const createdSeries = await this.prismaService.series.create({
                data: {
                    ...createSeriesData,
                    createdAt : this.utilService.getCurrentDateInKorea(),
                    releasedAt : (createSeriesData.status) ? releaseDate : undefined
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
     * @param userId
     */
    async getSeriesByUserId(userId : number) : Promise<SeriesWithWriterDto[]>{
        const followingUserList = await this.userService.getFollowingUserIdentityListByFollowerId(userId);
        const followingUserIdList = followingUserList.map(user => user.id);
        const seriesList = await this.prismaService.series.findMany({
            where:{
                deleted : false,
                status : true,
                writerId : {
                    in: followingUserIdList
                }
            },
            orderBy:{
                releasedAt : 'desc'
            }
        })
        if(!seriesList) return [];
        return SeriesDtoMapper.SeriesListAndWriterDtoListToSeriesWithWriterDtoList(seriesList,followingUserList);
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
     * @returns SeriesDto
     * @throws USER_NOT_WRITER
     */
    async getSeriesListByWriterId(writerId: number): Promise<SeriesDto[]> {
        await this.authValidationService.assertWriter(writerId);
        try {
            const seriesList = await this.prismaService.series.findMany({
                where: {
                    deleted: false,
                    writerId: writerId
                }
            })
            return SeriesDtoMapper.SeriesListToSeriesDtoList(seriesList);
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
     * @returns SeriesDto
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


}

import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateSeriesDto} from "./dto/createSeries.dto";
import {UtilService} from "../util/util.service";
import SeriesDtoMapper from "./seriesDtoMapper";
import {SeriesDto} from "./dto/series.dto";
import {ExceptionList} from "../response/error/errorInstances";
import {UserService} from "../user/user.service";
import {SeriesWithWriterDto} from "./dto/seriesWithWriter.dto";

@Injectable()
export class SeriesService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly userService: UserService,
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


}

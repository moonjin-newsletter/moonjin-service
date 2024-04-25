import {Series} from "@prisma/client";
import { UserProfileDto} from "../user/dto";
import {SeriesDto, SeriesSummaryDto, SeriesWithWriterDto} from "./dto";
import {FollowingSeriesAndWriter} from "./prisma/followingSeriesAndWriter.prisma.type";
import UserDtoMapper from "../user/userDtoMapper";

class SeriesDtoMapperClass {
    SeriesToSeriesDto(series : Series): SeriesDto {
        const {deleted, createdAt ,...seriesData} = series;
        return seriesData;
    }


    SeriesAndWriterDtoToSeriesWithWriterDto(series : Series, writerUserProfileData : UserProfileDto): SeriesWithWriterDto {
        return {
            series: this.SeriesToSeriesDto(series),
            writer: writerUserProfileData
        }
    }

    FollowingSeriesAndWriterToSeriesWithWriterDto(followingSeriesAndWriter : FollowingSeriesAndWriter):SeriesWithWriterDto{
        const { writerInfo} = followingSeriesAndWriter;
        const userProfileData = UserDtoMapper.UserToUserProfileDto(writerInfo.user);
        return this.SeriesAndWriterDtoToSeriesWithWriterDto(writerInfo.series[0], userProfileData);
    }

    SeriesDtoToSeriesSummaryDto(series : SeriesDto):SeriesSummaryDto{
        const {cover, status, lastUpdatedAt, clicks, category, description, writerId,...seriesSummaryData} = series;
        return seriesSummaryData;
    }

}
const SeriesDtoMapper = new SeriesDtoMapperClass();
export default SeriesDtoMapper;
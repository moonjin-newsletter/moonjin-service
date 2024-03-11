import {Series} from "@prisma/client";
import { UserProfileDto} from "../user/dto";
import {ReleasedSeriesDto, SeriesDto, ReleasedSeriesWithWriterDto, UnreleasedSeriesDto} from "./dto";
import {FollowingSeriesAndWriter} from "./prisma/followingSeriesAndWriter.prisma.type";
import UserDtoMapper from "../user/userDtoMapper";

class SeriesDtoMapperClass {
    SeriesToSeriesDto(series : Series): SeriesDto {
        const {deleted, createdAt ,...seriesData} = series;
        return seriesData;
    }
    SeriesToUnreleasedSeriesDto(series : Series): UnreleasedSeriesDto {
        return this.SeriesToSeriesDto(series);
    }

    SeriesToReleasedSeriesDto(series : Series, releasedDate : Date): ReleasedSeriesDto {
        const seriesData = this.SeriesToSeriesDto(series);
        return {...seriesData, releasedAt : series.releasedAt?? releasedDate};
    }

    SeriesAndWriterDtoToSeriesWithWriterDto(series : Series, releasedAt : Date, writerUserProfileData : UserProfileDto): ReleasedSeriesWithWriterDto {
        return {
            series: this.SeriesToReleasedSeriesDto(series, releasedAt),
            writer: writerUserProfileData
        }
    }

    SeriesListToReleasedSeriesDtoList(seriesList : Series[]): ReleasedSeriesDto[] {
        const releasedSeriesList : ReleasedSeriesDto[] = [];
        seriesList.forEach(series => {
            if(series.releasedAt !== null) releasedSeriesList.push(this.SeriesToReleasedSeriesDto(series, series.releasedAt));
        })
        return releasedSeriesList;
    }

    FollowingSeriesAndWriterListToSeriesWithWriterDtoList(followingSeriesAndWriter : FollowingSeriesAndWriter[]): ReleasedSeriesWithWriterDto[] {
        const seriesWithWriterList : ReleasedSeriesWithWriterDto[] = [];
        followingSeriesAndWriter.forEach(followingSeriesAndWriter => {
            const { writerInfo} = followingSeriesAndWriter;
            const userProfileData = UserDtoMapper.UserToUserProfileDto(writerInfo.user);
            writerInfo.series.forEach(series => {
                if(!series.releasedAt) return;
                seriesWithWriterList.push(this.SeriesAndWriterDtoToSeriesWithWriterDto(series, series.releasedAt, userProfileData));
            })
        })
        return seriesWithWriterList;
    }

}
const SeriesDtoMapper = new SeriesDtoMapperClass();
export default SeriesDtoMapper;
import {Series} from "@prisma/client";
import { UserProfileDto} from "../user/dto";
import {SeriesDto, SeriesSummaryDto, SeriesWithWriterDto} from "./dto";

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

    SeriesDtoToSeriesSummaryDto(series : SeriesDto):SeriesSummaryDto{
        const {cover, status, lastUpdatedAt, clicks, category, description, writerId,...seriesSummaryData} = series;
        return seriesSummaryData;
    }

}
const SeriesDtoMapper = new SeriesDtoMapperClass();
export default SeriesDtoMapper;
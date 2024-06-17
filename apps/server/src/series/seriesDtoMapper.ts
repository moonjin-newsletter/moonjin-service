import {Series} from "@prisma/client";
import {SeriesDto, SeriesSummaryDto} from "./dto";

class SeriesDtoMapperClass {
    SeriesToSeriesDto(series : Series): SeriesDto {
        const {deleted, createdAt ,...seriesData} = series;
        return seriesData;
    }

    SeriesDtoToSeriesSummaryDto(series : SeriesDto):SeriesSummaryDto{
        const { status, lastUpdatedAt, clicks, category, description, writerId,...seriesSummaryData} = series;
        return seriesSummaryData;
    }

}
const SeriesDtoMapper = new SeriesDtoMapperClass();
export default SeriesDtoMapper;
import {Series} from "@prisma/client";
import {SeriesDto, SeriesSummaryDto} from "./dto";
import {Category} from "@moonjin/api-types";

class SeriesDtoMapperClass {
    SeriesToSeriesDto(series : Series): SeriesDto {
        const {deleted, createdAt ,category,...seriesData} = series;
        return {
            category : Category.getCategoryByNumber(category),
            ...seriesData
        };
    }

    SeriesDtoToSeriesSummaryDto(series : SeriesDto):SeriesSummaryDto{
        const { lastUpdatedAt, clicks, category, description, writerId,...seriesSummaryData} = series;
        return seriesSummaryData;
    }

}
const SeriesDtoMapper = new SeriesDtoMapperClass();
export default SeriesDtoMapper;
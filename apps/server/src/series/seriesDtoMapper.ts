import {SeriesDto} from "./dto/series.dto";
import {Series} from "@prisma/client";

class SeriesDtoMapperClass {
    SeriesToSeriesDto(series: Series): SeriesDto {
        const {deleted, createdAt, ...seriesData} = series;
        return seriesData;
    }

}
const SeriesDtoMapper = new SeriesDtoMapperClass();
export default SeriesDtoMapper;
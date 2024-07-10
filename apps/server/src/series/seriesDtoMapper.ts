import {Series} from "@prisma/client";
import {SeriesDto} from "./dto";
import {Category} from "@moonjin/api-types";

class SeriesDtoMapperClass {
    SeriesToSeriesDto(series : Series): SeriesDto {
        const {deleted ,category,...seriesData} = series;
        return {
            category : Category.getCategoryByNumber(category),
            ...seriesData
        };
    }
}
const SeriesDtoMapper = new SeriesDtoMapperClass();
export default SeriesDtoMapper;
import {SeriesDto} from "./dto/series.dto";
import {Series} from "@prisma/client";
import {UserIdentityDto} from "../user/dto/userIdentity.dto";
import {SeriesWithWriterDto} from "./dto/seriesWithWriter.dto";

class SeriesDtoMapperClass {
    SeriesToSeriesDto(series : Series): SeriesDto {
        const {deleted, createdAt ,...seriesData} = series;
        return seriesData;
    }

    SeriesListToSeriesDtoList(seriesList: Series[]): SeriesDto[] {
        return seriesList.map(series => this.SeriesToSeriesDto(series));
    }

    SeriesAndWriterDtoToSeriesWithWriterDto(seriesDto : Series, writerData : UserIdentityDto): SeriesWithWriterDto {
        const {writerId, ...series} = seriesDto;
        return {...series, writer: writerData}
    }

    SeriesListAndWriterDtoListToSeriesWithWriterDtoList(seriesList : Series[], writerDataList : UserIdentityDto[]): SeriesWithWriterDto[] {
        const seriesWithWriterList : SeriesWithWriterDto[] = []
        seriesList.forEach(series => {
            const followingUser = writerDataList.find(writer => writer.id === series.writerId);
            if(followingUser){
                seriesWithWriterList.push(this.SeriesAndWriterDtoToSeriesWithWriterDto(series,followingUser))
            }
        })
        return seriesWithWriterList;
    }
}
const SeriesDtoMapper = new SeriesDtoMapperClass();
export default SeriesDtoMapper;
import {SeriesDto} from "./series.dto";
import {PaginationMetaDataDto} from "../../common/pagination/dto";

export interface SeriesListWithPaginationDto {
    seriesList : SeriesDto[],
    pagination: PaginationMetaDataDto
}
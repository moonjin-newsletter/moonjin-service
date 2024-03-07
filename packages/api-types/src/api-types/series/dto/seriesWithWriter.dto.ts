import {UserIdentityDto} from "../../user/dto/userIdentity.dto";
import {SeriesDto} from "./series.dto";

export interface SeriesWithWriterDto {
    series: SeriesDto;
    writer: UserIdentityDto;
}
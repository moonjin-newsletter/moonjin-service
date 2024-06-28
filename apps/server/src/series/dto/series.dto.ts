import {SeriesSummaryDto} from "./seriesSummary.dto";
import {CategoryEnum} from "../../common/category.enum";

export interface SeriesDto extends SeriesSummaryDto {
    writerId : number;
    category : CategoryEnum;
    clicks : number;
    description : string | null;
    lastUpdatedAt : Date;
}
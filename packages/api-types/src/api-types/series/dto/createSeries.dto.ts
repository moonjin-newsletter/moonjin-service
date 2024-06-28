import {CategoryEnum} from "../../common/category.enum";

export interface CreateSeriesDto {
    title: string;
    writerId : number;
    category : CategoryEnum;
    cover? : string;
    description? : string;
}
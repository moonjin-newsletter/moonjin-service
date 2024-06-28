import { tags } from "typia";
import {CategoryEnum} from "../../common/category.enum";

export interface ICreateSeries {
    title: string & tags.MaxLength<32>;
    category : CategoryEnum;
    cover? : string & tags.MaxLength<128>;
    description? : string & tags.MaxLength<256>;
}
import { tags } from "typia";
import {CategoryEnum} from "../../common/category.enum";

export interface IUpdateSeries {
    title: string & tags.MaxLength<32>;
    category : CategoryEnum;
    description : string & tags.MaxLength<256>;
    cover? : string & tags.MaxLength<128>;
}
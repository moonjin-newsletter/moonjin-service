import {tags} from "typia";
import {EditorJsonDto} from "@moonjin/editorjs";
import {CategoryEnum} from "../../common/category.enum";

export interface ICreatePost {
    title: string & tags.MaxLength<32>;
    content: EditorJsonDto;
    category?: CategoryEnum;
    subtitle?: string & tags.MaxLength<128>;
    cover?: string & tags.MaxLength<128>;
    seriesId? : number & tags.Minimum<0>;
}
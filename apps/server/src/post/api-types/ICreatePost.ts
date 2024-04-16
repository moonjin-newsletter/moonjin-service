import {tags} from "typia";
import {EditorJsonDto} from "../../common/editor/dto";

export interface ICreatePost {
    title: string & tags.MaxLength<32>;
    content: EditorJsonDto;
    category?: string & tags.MaxLength<16>;
    status?: boolean;
    subtitle?: string & tags.MaxLength<128>;
    cover?: string & tags.MaxLength<128>;
    seriesId? : number & tags.Minimum<0>;
}
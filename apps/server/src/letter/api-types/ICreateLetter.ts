import {tags} from "typia";

export interface ICreateLetter {
    receiverEmail: string & tags.Format<"email"> & tags.MaxLength<64>;
    title: string & tags.MinLength<2> & tags.MaxLength<64>
    content: string & tags.MaxLength<2048>
}
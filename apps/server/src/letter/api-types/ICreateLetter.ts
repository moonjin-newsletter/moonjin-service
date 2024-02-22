import {tags} from "typia";

export interface ICreateLetter {
    receiverId: number;
    title: string & tags.MinLength<2> & tags.MaxLength<64>
    content: string & tags.MaxLength<2048>
}
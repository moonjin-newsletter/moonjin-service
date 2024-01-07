import {tags} from "typia";

export interface ICheckEmailExist{
    email: string & tags.Format<"email"> & tags.MaxLength<32>;
}
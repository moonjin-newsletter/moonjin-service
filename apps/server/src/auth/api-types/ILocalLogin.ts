import {tags} from "typia";

export interface ILocalLogin {
    email: string & tags.Format<"email"> & tags.MaxLength<32>;
    password: string & tags.MinLength<4> & tags.MaxLength<16>;
}
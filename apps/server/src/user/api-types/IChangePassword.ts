import {tags} from "typia";

export interface IChangePassword {
    newPassword: string & tags.MinLength<4> & tags.MaxLength<16>;
}
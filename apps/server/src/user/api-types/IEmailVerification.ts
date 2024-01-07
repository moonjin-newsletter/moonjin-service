import {tags} from "typia";

export interface IEmailVerification {
    code: string & tags.MaxLength<64>
}
import {tags} from "typia";

export interface IChangeUserProfile {
    nickname?: string & tags.MinLength<2> & tags.MaxLength<16>;
    image?: string & tags.MaxLength<128>;
    description?: string & tags.MaxLength<128>;
}
import {tags} from "typia";
import {IChangeUserProfile} from "./IChangeUserProfile";

export interface IChangeWriterProfile extends IChangeUserProfile{
    moonjinId?: string & tags.MaxLength<32>;
}
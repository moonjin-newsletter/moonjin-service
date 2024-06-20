import {tags} from "typia";
import {IChangeUserProfile} from "../../user/api-types/IChangeUserProfile";

export interface IChangeWriterProfile extends IChangeUserProfile{
    moonjinId?: string & tags.MaxLength<32>;
}
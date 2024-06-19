import {tags} from "typia";

export interface IAddExternalUserFromForm{
    writerMoonjinId: string & tags.MinLength<2> & tags.MaxLength<32>;
    subscriberEmail: string & tags.Format<"email"> & tags.MaxLength<64>;
    subscriberName : string & tags.MaxLength<32>;
}
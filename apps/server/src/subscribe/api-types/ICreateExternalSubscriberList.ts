import {tags} from "typia";

export interface ICreateExternalSubscriberList {
    followerEmail: Array<string & tags.Format<"email"> & tags.MaxLength<64>>
}
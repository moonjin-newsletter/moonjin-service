import { tags } from "typia";

export interface ICreateExternalSubscriber {
    followerEmail: string & tags.MaxLength<64>;
}
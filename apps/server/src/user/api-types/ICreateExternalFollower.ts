import { tags } from "typia";

export interface ICreateExternalFollower {
    followerEmail: string & tags.MaxLength<64>;
}
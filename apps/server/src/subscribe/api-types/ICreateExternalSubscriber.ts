import { tags } from "typia";

export interface ICreateExternalSubscriber {
    subscriberEmail: string & tags.MaxLength<64>;
    subscriberName: string & tags.MaxLength<32>;
}
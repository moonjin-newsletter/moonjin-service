import {tags} from "typia";

export interface IDeleteExternalSubscriber{
    subscriberEmail: string & tags.MaxLength<64>;
}
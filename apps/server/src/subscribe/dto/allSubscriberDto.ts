import {SubscriberDto} from "./subscriberDto";
import {ExternalSubscriberDto} from "./externalSubscriberDto";

export interface AllSubscriberDto {
    subscriberList : SubscriberDto[];
    externalSubscriberList : ExternalSubscriberDto[];
}
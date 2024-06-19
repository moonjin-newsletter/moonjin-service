import {SubscriberDto} from "./subscriber.dto";
import {ExternalSubscriberDto} from "./externalSubscriber.dto";

export interface AllSubscriberDto {
    subscriberList : SubscriberDto[];
    externalSubscriberList : ExternalSubscriberDto[];
}
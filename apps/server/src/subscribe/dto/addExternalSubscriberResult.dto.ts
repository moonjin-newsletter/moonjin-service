import {ExternalSubscriberDto} from "./externalSubscriber.dto";

export interface AddExternalSubscriberResultDto {
    success: ExternalSubscriberDto[];
    fail: ExternalSubscriberDto[];
    message : string;
    createdAt : Date;
}
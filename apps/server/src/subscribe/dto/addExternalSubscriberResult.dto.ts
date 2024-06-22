import {ExternalSubscriberInfoDto} from "./externalSubscriberInfo.dto";

export interface AddExternalSubscriberResultDto {
    success: ExternalSubscriberInfoDto[];
    fail: ExternalSubscriberInfoDto[];
    message : string;
    createdAt : Date;
}
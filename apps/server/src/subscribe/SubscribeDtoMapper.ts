import {SubscriberDto, SubscribingWriterProfileDto} from "./dto";
import {SubscribingWriterInfoWithUser} from "./prisma/subscribingWriterInfoWithUser.prisma.type";
import UserDtoMapper from "../user/userDtoMapper";
import {SubscribeExternal, User} from "@prisma/client";
import {ExternalSubscriberDto} from "./dto";
import {ExternalSubscribeDto} from "./dto/externalSubscribe.dto";


class SubscribeDtoMapper{
    public static SubscribingWriterInfoWithUserToSubscribingWriterDto(subscribingWriterInfoWithUser: SubscribingWriterInfoWithUser): SubscribingWriterProfileDto {
        const {writerInfo, createdAt} = subscribingWriterInfoWithUser;
        const {user, ...writerInfoData} = writerInfo;
        return {
            user: UserDtoMapper.UserToUserProfileDto(user),
            writerInfo: UserDtoMapper.WriterInfoToWriterInfoDto(writerInfoData),
            following: {
                createdAt
            }
        }
    }

    public static UserToSubscriberDto(user: User, createdAt : Date): SubscriberDto {
        return {
            user: UserDtoMapper.UserToUserDto(user),
            subscribe: {
                createdAt
            }
        }
    }

    public static SubscriberExternalToExternalSubscriberDto(externalFollow : SubscribeExternal): ExternalSubscriberDto {
        return {
            subscriberEmail : externalFollow.subscriberEmail,
            subscriberName : externalFollow.subscriberName
        }
    }

    public static SubscriberExternalToExternalSubscribeDto(externalFollow : SubscribeExternal): ExternalSubscribeDto {
        return {
            subscriberEmail : externalFollow.subscriberEmail,
            subscriberName : externalFollow.subscriberName,
            createdAt : externalFollow.createdAt
        }
    }
}
export default SubscribeDtoMapper;
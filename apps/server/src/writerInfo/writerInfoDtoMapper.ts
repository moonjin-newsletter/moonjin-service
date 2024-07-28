import {WriterInfoWithUser} from "../user/prisma/writerInfoWithUser.prisma.type";
import {WriterInfoDto, WriterProfileDto, WriterProfileInCardDto} from "./dto";
import UserDtoMapper from "../user/userDtoMapper";
import {WriterInfo} from "@prisma/client";


export class WriterInfoDtoMapper {

    public static WriterInfoToWriterInfoDto(writerInfo : WriterInfo): WriterInfoDto{
        const {deleted, createdAt,...writerData} = writerInfo;
        return writerData
    }

    public static WriterInfoWithUserToWriterProfileDto(writerInfoWithUser: WriterInfoWithUser): WriterProfileDto{
        const { user, ...writerInfo} = writerInfoWithUser;
        return {
            user : UserDtoMapper.UserToUserProfileDto(writerInfoWithUser.user),
            writerInfo : this.WriterInfoToWriterInfoDto(writerInfo)
        }
    }

    public static WriterInfoWithUserToWriterInfoInCardDto(writerInfoWithUser: WriterInfoWithUser): WriterProfileInCardDto{
        return {
            userId: writerInfoWithUser.user.id,
            moonjinId : writerInfoWithUser.moonjinId,
            nickname : writerInfoWithUser.user.nickname
        }
    }
}
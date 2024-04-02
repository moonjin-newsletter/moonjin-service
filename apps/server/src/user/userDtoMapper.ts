import {ExternalFollow, User, WriterInfo} from "@prisma/client";
import {UserAuthDto, WriterInfoDto} from "../auth/dto";
import {UserDto, FollowingWriterProfileDto, WriterDto, UserProfileDto, FollowerDto} from "./dto";
import { WriterInfoWithUser} from "./prisma/writerInfo.prisma.type";
import {FollowingWriterInfoWithUser} from "./prisma/followingWriterInfoWithUser.prisma.type";

class UserDtoMapperClass {
    UserToUserAuthDto(user: User): UserAuthDto {
        const {deleted, createdAt, password, description, image,...userData} = user;
        return userData;
    }

    UserToUserDto(user: User): UserDto {
        const {deleted, password,...userData} = user;
        return userData;
    }

    WriterInfoToWriterInfoDto(writerInfo : WriterInfo): WriterInfoDto{
        const {deleted, createdAt, status,...writerData} = writerInfo;
        return writerData
    }

    UserWithWriterInfoToUserAndWriterInfoDto(writer: WriterInfoWithUser): WriterDto{
        const {user,...writerInfo} = writer;
        return {
            user: this.UserToUserDto(user),
            writerInfo: this.WriterInfoToWriterInfoDto(writerInfo)
        }
    }

    UserToUserProfileDto(user: User): UserProfileDto {
        const {deleted, password,email, ...userData} = user;
        return userData;
    }

    FollowAndUserToFollowerDto(user: User, createdAt : Date): FollowerDto {
        return {
            user: this.UserToUserProfileDto(user),
            following: {
                createdAt
            }
        }
    }

    ExternalFollowerToExternalFollowerDto(externalFollow : ExternalFollow) {
        return {
            email : externalFollow.followerEmail,
            createdAt : externalFollow.createdAt
        }
    }

    UserDtoToUserAuthDto(userDto: UserDto): UserAuthDto {
        const {image,description,createdAt, ...userData} = userDto;
        return userData;
    }

    FollowingWriterInfoWithUserToFollowingWriterDto(followingWriterInfoWithUser: FollowingWriterInfoWithUser): FollowingWriterProfileDto {
        const {writerInfo, createdAt} = followingWriterInfoWithUser;
        const {user, ...writerInfoData} = writerInfo;
        return {
            user: this.UserToUserProfileDto(user),
            writerInfo: this.WriterInfoToWriterInfoDto(writerInfoData),
            following: {
                createdAt
            }
        }
    }
}
const UserDtoMapper = new UserDtoMapperClass();
export default UserDtoMapper;
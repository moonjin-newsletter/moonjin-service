import {ExternalFollow, User, WriterInfo} from "@prisma/client";
import {UserAuthDto, WriterInfoDto} from "../auth/dto";
import {UserDto, UserIdentityDto, FollowingWriterDto, WriterDto, UserProfileDto, FollowerDto} from "./dto";
import { WriterInfoWithUser} from "./prisma/writerInfo.prisma.type";

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

    UserIdentityAndWriterInfoDtoAndFollowingToFollowingWriterDtoList(userList: UserIdentityDto[], writerInfoList : WriterInfoDto[], followingList : {writerId : number, createdAt : Date}[]) : FollowingWriterDto[]{
        const followingWriterList : FollowingWriterDto[] = [];

        followingList.forEach((following) => {
            const writerInfo = writerInfoList.find((writerInfo) => writerInfo.userId === following.writerId);
            const user = userList.find((user) => user.id === following.writerId);
            if(user && writerInfo) {
                followingWriterList.push({
                    user,
                    writer: writerInfo,
                    following: {
                        createdAt: following.createdAt
                    }
                })
            }
        })
        return followingWriterList;
    }

    UserToUserProfileDto(user: User): UserProfileDto {
        const {deleted, password,email, ...userData} = user;
        return userData;
    }

    FollowAndUserToFollwerDto(user: User, createdAt : Date): FollowerDto {
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
}
const UserDtoMapper = new UserDtoMapperClass();
export default UserDtoMapper;
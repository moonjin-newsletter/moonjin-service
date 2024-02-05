import {User, WriterInfo} from "@prisma/client";
import {UserAuthDto} from "../auth/dto/userAuthDto";
import {WriterInfoDto} from "../auth/dto/writerInfoDto";
import {UserDto} from "./dto/user.dto";
import {UserIdentityDto} from "./dto/userIdentity.dto";
import {FollowingWriterDto} from "./dto/followingWriter.dto";

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

}
const UserDtoMapper = new UserDtoMapperClass();
export default UserDtoMapper;
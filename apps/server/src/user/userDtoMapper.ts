import { User, WriterInfo} from "@prisma/client";
import {UserAuthDto} from "../auth/dto";
import {UserDto, UserProfileDto} from "./dto";
import { WriterInfoWithUser} from "./prisma/writerInfoWithUser.prisma.type";
import {WriterDto, WriterInfoDto} from "../writer/dto";

class UserDtoMapper {
    public static UserToUserAuthDto(user: User): UserAuthDto {
        const {deleted, createdAt, password, image,...userData} = user;
        return userData;
    }

    public static UserToUserDto(user: User): UserDto {
        const {deleted, password,...userData} = user;
        return userData;
    }

    public static WriterInfoToWriterInfoDto(writerInfo : WriterInfo): WriterInfoDto{
        const {deleted, createdAt, status,...writerData} = writerInfo;
        return writerData
    }

    public static UserWithWriterInfoToUserAndWriterInfoDto(writer: WriterInfoWithUser): WriterDto{
        const {user,...writerInfo} = writer;
        return {
            user: this.UserToUserDto(user),
            writerInfo: this.WriterInfoToWriterInfoDto(writerInfo)
        }
    }

    public static UserToUserProfileDto(user: User): UserProfileDto {
        const {deleted, password,email, ...userData} = user;
        return userData;
    }

    public static UserDtoToUserAuthDto(userDto: UserDto): UserAuthDto {
        const {image,createdAt, ...userData} = userDto;
        return userData;
    }
}
export default UserDtoMapper;
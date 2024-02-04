import {User, WriterInfo} from "@prisma/client";
import {UserAuthDto} from "../auth/dto/userAuthDto";
import {WriterInfoDto} from "../auth/dto/writerInfoDto";
import {UserDto} from "./dto/user.dto";

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
}
const UserDtoMapper = new UserDtoMapperClass();
export default UserDtoMapper;
import {User, WriterInfo} from "@prisma/client";
import {UserDto} from "../auth/dto/user.dto";
import {WriterInfoDto} from "../auth/dto/writerInfoDto";

class UserDtoMapperClass {
    UserToUserDto(user: User): UserDto {
        const {deleted, createdAt, password,...userData} = user;
        return {...userData};
    }

    WriterInfoToWriterInfoDto(writerInfo : WriterInfo): WriterInfoDto{
        const {deleted, createdAt, status,...writerData} = writerInfo;
        return writerData
    }
}
const UserDtoMapper = new UserDtoMapperClass();
export default UserDtoMapper;
import {User, WriterInfo} from "@prisma/client";
import {UserDto} from "./dto/user.dto";
import {WriterInfoDto} from "./dto/writerInfoDto";

class AuthDtoMapperClass {
    UserToUserDto(user: User): UserDto {
        const {deleted, createdAt, password, status,...userData} = user;
        return {...userData};
    }

    WriterInfoToWriterInfoDto(writerInfo : WriterInfo): WriterInfoDto{
        const {deleted, createdAt, status,...writerData} = writerInfo;
        return writerData
    }
}
const AuthDtoMapper = new AuthDtoMapperClass();
export default AuthDtoMapper;
import {User, WriterInfo} from "@prisma/client";
import {UserDto, WriterDto} from "./dto/user.dto";
import {WriterInfoDto} from "./dto/writerInfoDto";

class AuthDtoMapperClass {
    UserToUserDto(user: User): UserDto {
        const {deleted, createdAt, password, status,...userData} = user;
        return {...userData};
    }

    UserToWriterDto(user: User, moonjinId: string): WriterDto {
        const {deleted, createdAt, password, status,...userData} = user;
        return {...userData, moonjinId};
    }

    WriterInfoToWriterInfoDto(writerInfo : WriterInfo): WriterInfoDto{
        const {deleted, createdAt, status,...writerData} = writerInfo;
        return writerData
    }
}
const AuthDtoMapper = new AuthDtoMapperClass();
export default AuthDtoMapper;
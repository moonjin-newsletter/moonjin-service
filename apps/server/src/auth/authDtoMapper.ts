import {User, WriterInfo} from "@prisma/client";
import {UserDto} from "./dto/user.dto";
import {WriterInfoDto} from "./dto/writerInfo.dto";

class AuthDtoMapperClass {
    UserToUserDto(user: User): UserDto {
        const {deleted, createdAt, password, status, ...userData} = user;
        return userData;
    }

    WriterInfoToWriterInfoDto(writerInfo : WriterInfo): WriterInfoDto{
        const {deleted, createdAt, status, moonjinId,...writerInfoData} = writerInfo;
        const moonjinEmail = moonjinId + "@" + process.env.MAILGUN_DOMAIN;
        return {moonjinEmail, ...writerInfoData};
    }
}
const AuthDtoMapper = new AuthDtoMapperClass();
export default AuthDtoMapper;
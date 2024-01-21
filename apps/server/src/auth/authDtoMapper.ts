import {User, Writer} from "@prisma/client";
import {UserDto} from "./dto/user.dto";
import {WriterDto} from "./dto/writer.dto";

class AuthDtoMapperClass {
    UserToUserDto(user: User): UserDto {
        const {deleted, createdAt, password, status,deletedAt,...userData} = user;
        return userData;
    }

    WriterToWriterDto(writer : Writer): WriterDto{
        const {deleted, createdAt, status, moonjinId,...writerData} = writer;
        const moonjinEmail = moonjinId + "@" + process.env.MAILGUN_DOMAIN;
        return {moonjinEmail, ...writerData};
    }
}
const AuthDtoMapper = new AuthDtoMapperClass();
export default AuthDtoMapper;
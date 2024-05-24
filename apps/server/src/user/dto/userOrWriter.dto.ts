import {UserDto} from "./user.dto";
import {WriterInfoDto} from "../../auth/dto";

export interface UserOrWriterDto {
    user : UserDto;
    writerInfo : WriterInfoDto | null;
}
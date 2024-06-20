import {UserDto} from "./user.dto";
import {WriterInfoDto} from "../../writerInfo/dto";

export interface UserOrWriterDto {
    user : UserDto;
    writerInfo : WriterInfoDto | null;
}
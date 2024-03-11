import {UserDto} from "./user.dto";
import {WriterInfoDto} from "../../auth/dto";

export interface WriterDto{
    user : UserDto;
    writerInfo : WriterInfoDto;
}
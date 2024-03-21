import {UserDto} from ".";
import {WriterInfoDto} from "../../auth/dto";

export interface WriterDto{
    user : UserDto;
    writerInfo : WriterInfoDto;
}
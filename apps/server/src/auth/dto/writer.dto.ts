import {WriterInfoDto} from "./writerInfo.dto";
import {UserDto} from "./user.dto";

export interface WriterDto extends UserDto{
    writerInfo : WriterInfoDto;
}
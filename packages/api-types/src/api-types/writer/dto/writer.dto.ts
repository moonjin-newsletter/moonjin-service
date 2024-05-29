import {UserDto} from "../../user/dto";
import {WriterInfoDto} from "./writerInfoDto";

export interface WriterDto{
    user : UserDto;
    writerInfo : WriterInfoDto;
}
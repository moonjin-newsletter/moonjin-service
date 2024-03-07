import {UserDto} from "./user.dto";
import {WriterInfoDto} from "../../auth/dto/writerInfoDto";

export interface WriterDto{
    user : UserDto;
    writerInfo : WriterInfoDto;
}
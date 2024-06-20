import {UserProfileDto} from "../../user/dto";
import {WriterInfoDto} from "./writerInfoDto";

export interface WriterProfileDto{
    user : UserProfileDto;
    writerInfo : WriterInfoDto;
}
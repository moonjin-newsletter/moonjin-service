import {UserProfileDto} from ".";
import {WriterInfoDto} from "../../auth/dto";

export interface WriterProfileDto{
    user : UserProfileDto;
    writerInfo : WriterInfoDto;
}
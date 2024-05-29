import {ChangeUserProfileDto} from "../../user/dto";

export interface ChangeWriterProfileDto extends ChangeUserProfileDto{
    moonjinId?: string;
}
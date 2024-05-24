import {ChangeUserProfileDto} from "./changeUserProfile.dto";

export interface ChangeWriterProfileDto extends ChangeUserProfileDto{
    moonjinId?: string;
}
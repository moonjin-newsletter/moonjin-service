import {UserProfileDto} from "./userProfile.dto";

export interface UserDto extends UserProfileDto{
    email: string;
}
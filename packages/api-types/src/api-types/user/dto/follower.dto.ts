import {UserProfileDto} from "./userProfile.dto";

export interface FollowerDto {
    user : UserProfileDto;
    following : {
        createdAt : Date;
    }
}
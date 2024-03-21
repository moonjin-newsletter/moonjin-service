import {UserProfileDto} from ".";

export interface FollowerDto {
    user : UserProfileDto;
    following : {
        createdAt : Date;
    }
}
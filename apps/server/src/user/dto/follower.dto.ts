import {UserDto} from ".";

export interface FollowerDto {
    user : UserDto;
    following : {
        createdAt : Date;
    }
}
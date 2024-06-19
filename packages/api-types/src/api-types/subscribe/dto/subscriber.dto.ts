import {UserDto} from "../../user/dto";

export interface SubscriberDto {
    user : UserDto;
    subscribe : {
        createdAt : Date;
    }
}
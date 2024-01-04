import {User} from "@prisma/client";
import {UserDto} from "./user.dto";

export class ReaderDto extends UserDto{
    constructor(userEntity : User) {
        super(userEntity.id, userEntity.email, userEntity.nickname, userEntity.role)
    }
}
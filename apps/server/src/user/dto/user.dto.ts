import {User} from "@prisma/client";

export class UserDto{
    id: number;
    email: string;
    password: string;
    nickname: string;
    role: number;

    constructor(userEntity : User) {
        this.id = userEntity.id;
        this.email= userEntity.email;
        this.password= userEntity.password || "";
        this.nickname= userEntity.nickname;
        this.role = userEntity.role;
    }
}
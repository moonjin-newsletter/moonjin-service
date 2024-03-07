import {UserRoleEnum} from "../../auth/enum/userRole.enum";

export interface UserDto {
    id: number;
    nickname: string;
    email: string;
    role: UserRoleEnum;
    image : string;
    description : string;
    createdAt : Date;
}
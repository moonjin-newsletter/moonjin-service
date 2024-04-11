import {UserRoleEnum} from "../../auth/enum/userRole.enum";

export interface UserProfileDto {
    id: number;
    nickname: string;
    role: UserRoleEnum;
    image : string;
    createdAt : Date;
}
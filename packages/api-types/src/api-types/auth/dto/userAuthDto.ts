import {UserRoleEnum} from "../enum/userRole.enum";

export interface UserAuthDto {
    id: number;
    email: string;
    nickname: string;
    role: UserRoleEnum
}
import {UserRoleEnum} from "../enum/userRole.enum";

export class UserDto {
    id: number;
    email: string;
    nickname: string;
    role: UserRoleEnum
}
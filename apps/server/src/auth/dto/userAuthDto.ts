import {UserRoleEnum} from "../enum/userRole.enum";

export class UserAuthDto {
    id: number;
    email: string;
    nickname: string;
    role: UserRoleEnum
}
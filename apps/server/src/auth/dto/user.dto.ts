import {UserRoleEnum} from "../enum/userRole.enum";

export class UserDto {
    id: number;
    email: string;
    nickname: string;
    role: UserRoleEnum
}

export interface WriterDto extends UserDto{
    role: UserRoleEnum.WRITER;
    moonjinId: string;
}
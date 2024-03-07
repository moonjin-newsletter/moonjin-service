import {UserRoleEnum} from "../enum/userRole.enum";

export interface SignupEmailCodePayloadDto {
    email: string;
    hashedPassword: string;
    nickname: string;
    role: UserRoleEnum;
    moonjinId? : string;
}
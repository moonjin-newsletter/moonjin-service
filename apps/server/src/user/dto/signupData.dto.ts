import {ILocalSignUp} from "../api-types/ILocalSignUp";

export class SignupDataDto {
    email: string;
    password: string;
    nickname: string;
    role: number;
    moonjinEmail? : string;

    constructor(localSignUpData : ILocalSignUp) {
        this.email = localSignUpData.email;
        this.password = localSignUpData.password;
        this.nickname = localSignUpData.nickname;
        this.role = localSignUpData.role;
        this.moonjinEmail = localSignUpData.moonjinEmail;
    }
}
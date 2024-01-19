
export interface SignupEmailCodePayloadDto {
    email: string;
    hashedPassword: string;
    nickname: string;
    role: number;
    moonjinId? : string;
}
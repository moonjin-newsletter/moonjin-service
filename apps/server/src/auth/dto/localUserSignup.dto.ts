export interface LocalUserSignupDto {
    email: string;
    hashedPassword: string;
    nickname: string;
    image?: string;
}
import {SocialProviderEnum} from "../enum/socialProvider.enum";

export interface SocialWriterSignupDto {
    oauthId: string;
    email: string;
    social: SocialProviderEnum;
    nickname: string;
    moonjinId: string;
    description?: string;
    image?: string;
}
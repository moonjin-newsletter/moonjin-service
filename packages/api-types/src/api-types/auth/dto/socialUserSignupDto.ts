import {SocialProviderEnum} from "../enum/socialProvider.enum";

export interface SocialUserSignupDto {
    oauthId: string;
    email: string;
    social: SocialProviderEnum;
    nickname: string;
    image?: string;
}
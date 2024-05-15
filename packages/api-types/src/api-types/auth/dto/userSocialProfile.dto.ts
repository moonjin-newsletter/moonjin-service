import {SocialProviderEnum} from "../enum/socialProvider.enum";

export interface UserSocialProfileDto {
    oauthId: string;
    email: string;
    social: SocialProviderEnum;
}
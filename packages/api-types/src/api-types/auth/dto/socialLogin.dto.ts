import {SocialProviderEnum} from "../enum/socialProvider.enum";

export interface SocialLoginDto {
    social: SocialProviderEnum;
    code: string;
}
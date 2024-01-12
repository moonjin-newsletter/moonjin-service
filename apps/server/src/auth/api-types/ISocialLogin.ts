import {SocialProviderEnum} from "../enum/socialProvider.enum";

export interface ISocialLogin{
    social : SocialProviderEnum;
    code: string;
}
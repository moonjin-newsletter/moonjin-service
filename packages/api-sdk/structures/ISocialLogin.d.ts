import type { SocialProviderEnum } from "./SocialProviderEnum";
export type ISocialLogin = {
    social: SocialProviderEnum;
    oauthCode: string;
};

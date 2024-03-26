import {Injectable} from "@nestjs/common";
import {SocialProviderEnum} from "./enum/socialProvider.enum";
import {OauthDto, SocialLoginDto, UserAuthDto, UserSocialProfileDto} from "./dto";
import {firstValueFrom} from "rxjs";
import {ExceptionList} from "../response/error/errorInstances";
import {HttpService} from "@nestjs/axios";
import {PrismaService} from "../prisma/prisma.service";
import UserDtoMapper from "../user/userDtoMapper";
import console from "console";
import OauthDtoMapper from "./oauthDtoMapper";

@Injectable()
export class OauthService {
    socialLoginUrlList : Record<SocialProviderEnum, string>;
    socialProfileApiUrlList : Record<SocialProviderEnum, string>;
    constructor(
        private readonly httpService: HttpService,
        private readonly prismaService: PrismaService,
    ) {
        this.socialLoginUrlList = {
            [SocialProviderEnum.NAVER]: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_OAUTH_CLIENT_ID}&redirect_uri=${process.env.SERVER_URL}/auth/oauth/login?social=naver&state=RANDOM_STATE`,
            [SocialProviderEnum.KAKAO]: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.SERVER_URL}/auth/oauth/login?social=kakao&response_type=code`,
            [SocialProviderEnum.GOOGLE]: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&response_type=code&redirect_uri=${process.env.SERVER_URL}/auth/oauth/login?social=google&client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}`,
        };
        this.socialProfileApiUrlList = {
            [SocialProviderEnum.NAVER]: 'https://openapi.naver.com/v1/nid/me',
            [SocialProviderEnum.KAKAO]: 'https://kapi.kakao.com/v2/user/me',
            [SocialProviderEnum.GOOGLE]: 'https://www.googleapis.com/oauth2/v2/userinfo',
        };
    }

    /**
     * @summary socialProvider에 맞는 social login url을 반환해줌
     * @param socialProvider
     * @returns socialLoginUrl
     */
    getSocialOauthUrl(socialProvider: SocialProviderEnum): string {
        return this.socialLoginUrlList[socialProvider];
    }

    /**
     * @summary 해당 social에 oauthCode를 전달하여 accessToken을 받아온다.
     * @param socialLoginData
     * @returns OauthAccessToken
     * @throws USER_NOT_FOUND_IN_SOCIAL
     */
    async getAccessTokenFromSocialOauth(socialLoginData : SocialLoginDto) : Promise<string>{
        const socialOauthUrlList = {
            [SocialProviderEnum.NAVER]: `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NAVER_OAUTH_CLIENT_ID}&client_secret=${process.env.NAVER_OAUTH_CLIENT_SECRET}&redirect_uri=${process.env.SERVER_URL}/auth/oauth/login?social=naver&code=${socialLoginData.code}&state=RANDOM_STATE`,
            [SocialProviderEnum.KAKAO]: `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.SERVER_URL}/auth/oauth/login?social=kakao&code=${socialLoginData.code}`,
            [SocialProviderEnum.GOOGLE]: `https://oauth2.googleapis.com/token?code=${socialLoginData.code}&client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}&client_secret=${process.env.GOOGLE_OAUTH_SECRET}&redirect_uri=${process.env.SERVER_URL}/auth/oauth/login?social=google&grant_type=authorization_code`,
        };

        try {
            const socialOauthResponse = await firstValueFrom(
                this.httpService.post(socialOauthUrlList[socialLoginData.social])
            );
            return socialOauthResponse.data.access_token;
        } catch (error) {
            console.log(error)
            throw ExceptionList.USER_NOT_FOUND_IN_SOCIAL;
        }
    }

    /**
     * @summary oauthAccessToken으로 해당 social에서 유저 정보 가져오기
     * @param social
     * @param oauthAccessToken
     * @returns UserSocialProfileDto
     * @throws SOCIAL_PROFILE_NOT_FOUND
     */
    async getUserProfileFromSocialOauth(social:SocialProviderEnum, oauthAccessToken: string) : Promise<UserSocialProfileDto>{
        try {
            const profileSearchResponse = await firstValueFrom(
                this.httpService.get(this.socialProfileApiUrlList[social], {
                    headers : {
                        Authorization: `Bearer ${oauthAccessToken}`,
                    }
                })
            )

            const socialProfileData = profileSearchResponse.data;
            let userSocialProfile : UserSocialProfileDto;
            switch (social) {
                case SocialProviderEnum.NAVER:
                    userSocialProfile = {
                        oauthId : socialProfileData.response.id,
                        email : socialProfileData.response.email,
                        social : social
                    }
                    break;
                case SocialProviderEnum.KAKAO:
                    userSocialProfile = {
                        oauthId : '' + socialProfileData.id,
                        email : socialProfileData.kakao_account.email,
                        social : social
                    }
                    break;
                case SocialProviderEnum.GOOGLE:
                    userSocialProfile = {
                        oauthId : socialProfileData.id,
                        email : socialProfileData.email,
                        social : social
                    }
                    break;
            }
            return userSocialProfile;
        }catch (error){
            console.log(error)
            throw ExceptionList.SOCIAL_PROFILE_NOT_FOUND;
        }
    }

    /**
     * @summary 소셜 로그인을 진행하는 함수
     * @param socialLoginData
     * @returns 유저 존재 시 유저 정보 반환, 실패 시 유저 email 반환
     * @throws USER_NOT_FOUND_IN_SOCIAL
     * @throws USER_NOT_FOUND
     * @throws SOCIAL_PROFILE_NOT_FOUND
     * @throws SOCIAL_LOGIN_ERROR
     */
    async socialLogin(socialLoginData : SocialLoginDto) : Promise<{result:true, data:UserAuthDto} | {result:false, data : UserSocialProfileDto}> {
        // 1. oauthCode로 accessToken 받아오기
        const oauthAccessToken = await this.getAccessTokenFromSocialOauth(socialLoginData);

        // 2. 해당 social로 부터 유저 정보 받아오기
        const userProfile = await this.getUserProfileFromSocialOauth(socialLoginData.social, oauthAccessToken)

        try{
            // 3. 존재하는 유저인지 확인
            const oauth = await this.prismaService.oauth.findUnique({
                where: {
                    oauthId : userProfile.oauthId,
                }
            })
            if(oauth){ // 유저 존재
                const user = await this.prismaService.user.findUnique({
                    where: {
                        id : oauth.userId
                    }
                })
                if(user){
                    return {
                        result : true,
                        data : UserDtoMapper.UserToUserAuthDto(user)
                    }
                } else {
                    throw ExceptionList.USER_NOT_FOUND;
                }
            } else{ //social signup 진행 페이지로 이동
                return {
                    result : false,
                    data : {
                        email : userProfile.email,
                        oauthId : userProfile.oauthId,
                        social: socialLoginData.social
                    }
                }
            }
        } catch (error){
            console.log(error);
            throw ExceptionList.SOCIAL_LOGIN_ERROR;
        }
    }

    /**
     * @summary 소셜 회원가입 진행
     * @param oauth
     */
    async oauthSignup(oauth : OauthDto): Promise<OauthDto> {
        try{
            return await this.prismaService.oauth.create({
                data:{
                    oauthId : oauth.oauthId,
                    social : oauth.social,
                    userId : oauth.userId
                }
            })
        }catch (error){
            console.error(error);
            throw ExceptionList.SOCIAL_SIGNUP_ERROR;
        }
    }

    /**
     * @summary userId로 해당 유저의 oauth 정보 가져오기
     * @param userId
     * @returns OauthDto
     * @throws OAUTH_NOT_FOUND
     */
    async getUserOauthByUserId(userId: number) : Promise<OauthDto> {
        try {
            const oauth = await this.prismaService.oauth.findUniqueOrThrow({
                where: {
                    userId
                }
            });
            return OauthDtoMapper.OauthToOauthDto(oauth)
        } catch (error){
            console.error(error);
            throw ExceptionList.OAUTH_NOT_FOUND;
        }
    }

    /**
     * @summary 해당 유저가 social 회원인지 확인
     * @param userId
     * @throws USER_NOT_FOUND_IN_SOCIAL
     */
    async assertUserSocial(userId: number) {
        const oauth = await this.prismaService.oauth.findUnique({
            where: {
                userId
            }
        });
        if(!oauth) {
            throw ExceptionList.USER_NOT_FOUND_IN_SOCIAL;
        }
    }

    /**
     * @summary 해당 유저가 social 회원이 아닌지 확인
     * @param userId
     * @throws SOCIAL_USER_ERROR
     */
    async assertUserNotSocial(userId: number) {
        const oauth = await this.prismaService.oauth.findUnique({
            where: {
                userId
            }
        });
        if(oauth) {
            throw ExceptionList.SOCIAL_USER_ERROR;
        }
    }
}

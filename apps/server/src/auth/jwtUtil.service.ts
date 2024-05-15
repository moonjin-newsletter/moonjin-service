import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ExceptionList} from "../response/error/errorInstances";
import {UserAccessTokensDto, UserAuthDto} from "./dto";

@Injectable()
export class JwtUtilService {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    /**
     * @summary jwtToken 생성
     * @param payload extends object
     * @param time 기본값 4 hours
     * @returns jwtToken
     */
    generateJwtToken<T extends object>(payload: T, time = 60*60*4): string{
        return this.jwtService.sign(payload, {
            expiresIn: time,
        });
    }

    /**
     * @summary 쿠키에서 토큰을 가져오는 함수.
     * @param cookies
     * @param cookieToFind
     * @throws TOKEN_NOT_FOUND
     * @returns token
     */
    getTokenFromCookie(cookies : string[], cookieToFind: string): string {
        const token = cookies.find(cookie => cookie.includes(cookieToFind));
        if(!token) throw ExceptionList.TOKEN_NOT_FOUND;
        return token.split('=')[1];
    }

    /**
     * @summary jwtToken의 payload를 가져오는 함수.
     * @param jwtToken
     * @throws INVALID_TOKEN
     */
    getDataFromJwtToken<T>(jwtToken: string) : T & {iat:number,exp: number}{
        try {
            return this.jwtService.decode<T>(jwtToken) as T & {iat:number,exp: number};
        } catch (error){
            throw ExceptionList.INVALID_TOKEN;
        }
    }

    /**
     * @summary userData가 담긴 atk, rtk을 발급
     * @param userData
     * @returns {accessToken, refreshToken}
     */
    getAccessTokens(userData: UserAuthDto) : UserAccessTokensDto {
        const accessToken = this.generateJwtToken(userData,60 * 15);
        const refreshToken = this.generateJwtToken(userData, 60 * 60 * 24 * 7);
        return {accessToken, refreshToken}
    }
}
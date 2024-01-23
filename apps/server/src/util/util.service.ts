import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ExceptionList} from "../response/error/errorInstances";
import * as crypto from "crypto";


@Injectable()
export class UtilService {
    constructor(private readonly jwtService: JwtService) {}

    /**
     * @summary inputString을 해시화
     * @param inputString
     * @returns hashedString
     */
    getHashCode(inputString: string): string {
        return crypto.createHash('sha256').update(inputString).digest('base64');
    }

    compareHash(
        inputString: string,
        hashedString: string
    ): boolean {
        return this.getHashCode(inputString).trim() === hashedString.trim()
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

    getRandomNumberIn6digits() {
        return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    }

    /**
     * @summary jwtToken 생성
     * @param payload extends object
     * @param time 기본값 1 day
     * @returns jwtToken
     */
    generateJwtToken<T extends object>(payload: T, time = 60*60*24): string{
        return this.jwtService.sign(payload, {
            expiresIn: time,
        });
    }

    /**
     * @summary jwtToken의 payload를 가져오는 함수.
     *
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
}

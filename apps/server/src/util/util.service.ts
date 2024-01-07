import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ExceptionList} from "../response/error/errorInstances";
import * as crypto from "crypto";


@Injectable()
export class UtilService {
    constructor(private readonly jwtService: JwtService) {}

    getHashCode(inputString: string): string {
        return crypto.createHash('sha256').update(inputString).digest('base64');
    }

    compareHash(
        inputString: string,
        hashedString: string
    ): boolean {
        return this.getHashCode(inputString).trim() === hashedString.trim()
    }

    getRandomNumberIn6digits() {
        return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    }

    generateJwtToken(payload: any, time = 60*60*14): string{
        return this.jwtService.sign({payload}, {
            expiresIn: time,
        });
    }

    /**
     * @summary jwtToken의 payload를 가져오는 함수.
     *
     * @param jwtToken
     * @throws INVALID_TOKEN
     */
    getDataFromJwtToken<T>(jwtToken: string): T {
        try {
            return this.jwtService.decode<T>(jwtToken);
        } catch (error){
            throw ExceptionList.INVALID_TOKEN;
        }
    }
}

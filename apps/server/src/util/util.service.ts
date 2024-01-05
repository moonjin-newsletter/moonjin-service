import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import {ExceptionList} from "../response/error/errorInstances";


@Injectable()
export class UtilService {
    constructor(private readonly jwtService: JwtService) {

    }

    async getHashCode(inputString: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(inputString, salt);
    }

    async compareHash(
        inputString: string,
        hashedString: string
    ): Promise<boolean> {
        return await bcrypt.compare(inputString, hashedString);
    }

    getRandomNumberIn6digits() {
        return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    }

    generateJwtToken(payload: any, time = 60*60*14): string{
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
    getDataFromJwtToken<T>(jwtToken: string): T {
        try {
            return this.jwtService.decode<T>(jwtToken);
        } catch (error){
            throw ExceptionList.INVALID_TOKEN;
        }
    }
}

import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';

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

    generateJwtToken(payload: any, time:number): string{
        return this.jwtService.sign(payload, {
            expiresIn: time,
        });
    }
}

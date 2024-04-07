import { Injectable } from '@nestjs/common';
import * as crypto from "crypto";


@Injectable()
export class UtilService {
    constructor() {
    }

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

    getCurrentDateInKorea(): Date {
        const date = new Date();
        date.setHours(date.getHours() + 9);
        return date;
    }

    processImageForCover(cover: string | undefined | null): string {
        const cdnUrl = process.env.CDN_URL?? "https://d1ppxineti4knh.cloudfront.net";
        if (cover) {
            return cover;
        } else {
            return cdnUrl + '/cover/default.png';
        }
    }

}

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
        if (cover) {
            return this.deletePrefixFromImageUrl(cover);
        } else {
            return 'cover/default.png';
        }
    }

    deletePrefixFromImageUrl(cover: string): string {
        const cdnUrl = process.env.CDN_URL ? process.env.CDN_URL + '/' : ".net/";
        if (cover.includes(cdnUrl)) {
            return cover.split(cdnUrl)[1]
        } else {
            return cover;
        }
    }
}

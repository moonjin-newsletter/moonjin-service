import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { getSignedUrl} from "@aws-sdk/s3-request-presigner";
import * as process from "process";
import {ExceptionList} from "../response/error/errorInstances";

@Injectable()
export class AwsService {
    s3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION, // AWS Region
            credentials: {
                accessKeyId: process.env.AWS_S3_ACCESS_KEY?? '',
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY?? ''
            },
        });
    }

    /**
     * @summary S3에 이미지 업로드를 위한 signedUrl을 생성합니다.
     * @param fileName
     * @returns signedUrl
     * @throws FILE_UPLOAD_ERROR
     */
    async getSignedUrlForImage(fileName: string) : Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket : process.env.AWS_S3_BUCKET_NAME,
                Key: fileName
            })
            return await getSignedUrl(this.s3Client, command, {
                expiresIn : 60 * 60
            });
        }catch (error){
            console.log(error);
            throw ExceptionList.FILE_UPLOAD_ERROR;
        }
    }


    async imageUploadToS3() {}

    async fileDeleteFromS3() {}

    async getImageFromS3() {}
}

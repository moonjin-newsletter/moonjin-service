import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { getSignedUrl} from "@aws-sdk/s3-request-presigner";
import * as process from "process";
import {ExceptionList} from "../response/error/errorInstances";
import { v4 as uuid } from 'uuid';
import {PreSignedUrlDto} from "../file/dto";
import {FileTypeEnum} from "../file/enum/fileType.enum";

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
     * @returns signedUrl
     * @throws FILE_EXTENTION_ERROR
     */
    async getSignedUrlForUpload(fileName : string, fileType : FileTypeEnum) : Promise<PreSignedUrlDto> {
        const ext = fileName.split('.')[1];
        fileName = fileType + '/' + uuid() + "." + ext;
        try {
            const command : PutObjectCommand = new PutObjectCommand({
                Bucket : process.env.AWS_S3_BUCKET_NAME,
                Key: fileName,
            })
            return {
                fileName,
                preSignedUrl : await getSignedUrl(this.s3Client, command, {
                    expiresIn : 60 * 60,
                })
            }
        }catch (error){
            console.log(error);
            throw ExceptionList.FILE_UPLOAD_ERROR;
        }
    }


    async imageUploadToS3() {}

    async fileDeleteFromS3() {}

    async getImageFromS3() {}
}

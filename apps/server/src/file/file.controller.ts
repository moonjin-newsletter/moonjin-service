import {Controller, UseGuards} from '@nestjs/common';
import {AwsService} from "../aws/aws.service";
import {TypedBody, TypedRoute} from "@nestia/core";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {IGetSignedUrl} from "./api-types/IGetSignedUrl";
import {createResponseForm} from "../response/responseForm";
import {TryCatch} from "../response/tryCatch";
import { FILE_UPLOAD_ERROR} from "../response/error/file";
import {PreSignedUrlDto} from "./dto";

@Controller('file')
export class FileController {

    constructor(
        private readonly awsService: AwsService
    ){}

    /**
     * @summary S3에 파일 업로드를 위한 signedUrl을 생성합니다.
     * @param body
     * @returns PreSignedUrlDto
     * @throws FILE_UPLOAD_ERROR
     */
    @TypedRoute.Post()
    @UseGuards(UserAuthGuard)
    async getPreSignedUrl(@TypedBody() body : IGetSignedUrl) : Promise<TryCatch< PreSignedUrlDto,
        FILE_UPLOAD_ERROR>>{
        return createResponseForm({
            ...await this.awsService.getSignedUrlForUpload(body.fileName, body.fileType)
        })
    }

}

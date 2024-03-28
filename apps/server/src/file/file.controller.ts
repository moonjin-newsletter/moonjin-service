import {Controller, UseGuards} from '@nestjs/common';
import {AwsService} from "../aws/aws.service";
import {TypedQuery, TypedRoute} from "@nestia/core";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {IGetSignedUrl} from "./api-types/IGetSignedUrl";
import {createResponseForm} from "../response/responseForm";
import {TryCatch} from "../response/tryCatch";
import {FILE_UPLOAD_ERROR} from "../response/error/file";

@Controller('file')
export class FileController {

    constructor(
        private readonly awsService: AwsService
    ){}

    @TypedRoute.Get('signed-url/image')
    @UseGuards(UserAuthGuard)
    async getSignedUrlForImage(@TypedQuery() query : IGetSignedUrl) : Promise<TryCatch<{url: string}, FILE_UPLOAD_ERROR>>{
        return createResponseForm({
            url : await this.awsService.getSignedUrlForImage(query.fileName)
        });
    }
}

import {Controller, UseGuards} from '@nestjs/common';
import {AwsService} from "../aws/aws.service";
import {TypedBody, TypedRoute} from "@nestia/core";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {IGetSignedUrl} from "./api-types/IGetSignedUrl";
import {createResponseForm} from "../response/responseForm";
import {TryCatch} from "../response/tryCatch";
import {FILE_UPLOAD_ERROR} from "../response/error/file";
import {FileTypeEnum} from "./enum/fileType.enum";

@Controller('file')
export class FileController {

    constructor(
        private readonly awsService: AwsService
    ){}

    @TypedRoute.Post()
    @UseGuards(UserAuthGuard)
    async getSignedUrlForImage(@TypedBody() body : IGetSignedUrl) : Promise<TryCatch<{url: string}, FILE_UPLOAD_ERROR>>{
        switch (body.type){
            case FileTypeEnum.IMAGE:
                return createResponseForm({
                    url : await this.awsService.getSignedUrlForImage()
                });

        }
    }
}

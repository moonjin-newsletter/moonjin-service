import { Controller } from '@nestjs/common';
import {SubscribeService} from "./subscribe.service";
import {TypedBody, TypedRoute} from "@nestia/core";
import {createResponseForm, ResponseMessage} from "../response/responseForm";
import {TryCatch} from "../response/tryCatch";
import {EMAIL_ALREADY_EXIST, USER_NOT_WRITER} from "../response/error/auth";
import {IAddExternalUserFromForm} from "./api-types/IAddExternalUserFromForm";
import {FOLLOWER_ALREADY_EXIST} from "../response/error/user";
import {WriterService} from "../writer/writer.service";

@Controller('subscribe')
export class SubscribeController {
    constructor(
        private readonly writerService:WriterService,
        private readonly subscribeService:SubscribeService
    ) {}

    /**
     * 구독폼에서 작가 구독 신청하기 API
     * @param body
     * @throws USER_NOT_WRITER
     * @throws EMAIL_ALREADY_EXIST
     * @throws FOLLOWER_ALREADY_EXIST
     */
    @TypedRoute.Post('form')
    async addSubscribeFromForm(@TypedBody() body : IAddExternalUserFromForm):Promise<TryCatch<ResponseMessage,
        USER_NOT_WRITER | EMAIL_ALREADY_EXIST | FOLLOWER_ALREADY_EXIST>>{
        const writerPublicCard = await this.writerService.getWriterPublicCardByMoonjinId(body.writerMoonjinId);
        await this.subscribeService.addExternalSubscriberByEmail(writerPublicCard.user.id, body.email);
        return createResponseForm({message: "구독 신청되었습니다."})
    }

}

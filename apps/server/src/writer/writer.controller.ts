import { Controller } from '@nestjs/common';
import {TypedParam, TypedRoute} from "@nestia/core";
import {WriterPublicCardDto} from "./dto";
import {TryCatch} from "../response/tryCatch";
import {USER_NOT_WRITER} from "@moonjin/api-types";
import {WriterService} from "./writer.service";
import {createResponseForm} from "../response/responseForm";

@Controller('writer')
export class WriterController {
    constructor(
        private readonly writerService: WriterService
    ) {}

    /**
     * moonjinId로 작가의 Public-Card를 가져오기 API
     * @param moonjinId
     */
    @TypedRoute.Get(':moonjinId/public-card')
    async getWriterPublicCard(@TypedParam("moonjinId") moonjinId : string): Promise<TryCatch<WriterPublicCardDto,
    USER_NOT_WRITER>>{
        const writerPublicCard = await this.writerService.getWriterPublicCardByMoonjinId(moonjinId);
        return createResponseForm(writerPublicCard)
    }
}

import {Controller, UseGuards} from '@nestjs/common';
import {TypedBody, TypedRoute} from "@nestia/core";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {ICreateLetter} from "./api-types/ICreateLetter";
import {UserAuthDto} from "../auth/dto/userAuthDto";
import {LetterService} from "./letter.service";
import {createResponseForm} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {SEND_LETTER_ERROR} from "../response/error/letter/letter.error";
import {USER_NOT_FOUND} from "../response/error/auth";
import {LetterWithSenderDto} from "./dto/LetterWithSender.dto";

@Controller('letter')
export class LetterController {
    constructor(
        private readonly letterService: LetterService,
    ){}

    /**
     * @summary 편지 발송 API
     * @param user
     * @param letterData
     * @returns
     * @throws SEND_LETTER_ERROR
     * @throws USER_NOT_EXIST
     */
    @TypedRoute.Post()
    @UseGuards(UserAuthGuard)
    async sendLetter(@User() user: UserAuthDto, @TypedBody() letterData: ICreateLetter): Promise<TryCatch<{ message:string, sentAt: Date },
        SEND_LETTER_ERROR | USER_NOT_FOUND>>{
        const letter = await this.letterService.sendLetter({...letterData, senderId: user.id});
        return createResponseForm({
            message : "편지 발송에 성공하였습니다.",
            sentAt : letter.createdAt
        });
    }

    /**
     * @summary 내 편지함 조회 API
     * @param user
     * @returns LetterWithSenderDto[]
     */
    @TypedRoute.Get()
    @UseGuards(UserAuthGuard)
    async getLetterList(@User() user: UserAuthDto) : Promise<Try<LetterWithSenderDto[]>> {
        return createResponseForm(await this.letterService.getLetterList(user.id));
    }


}

import {Controller, UseGuards} from '@nestjs/common';
import {TypedBody, TypedParam, TypedRoute} from "@nestia/core";
import {UserAuthGuard} from "../auth/guard/userAuth.guard";
import {User} from "../auth/decorator/user.decorator";
import {ICreateLetter} from "./api-types/ICreateLetter";
import {UserAuthDto} from "../auth/dto";
import {LetterService} from "./letter.service";
import {createResponseForm} from "../response/responseForm";
import {Try, TryCatch} from "../response/tryCatch";
import {LETTER_ALREADY_READ, LETTER_NOT_FOUND, FORBIDDEN_FOR_LETTER, SEND_LETTER_ERROR} from "../response/error/letter";
import {USER_NOT_FOUND} from "../response/error/auth";
import {CreateLetterDto, LetterWithUserDto} from "./dto";
import {UtilService} from "../util/util.service";
import {UserService} from "../user/user.service";

@Controller('letter')
export class LetterController {
    constructor(
        private readonly letterService: LetterService,
        private readonly utilService: UtilService,
        private readonly userService: UserService
    ){}

    /**
     * @summary 편지 발송 API
     * @param user
     * @param letterData
     * @returns
     * @throws USER_NOT_EXIST
     * @throws SEND_LETTER_ERROR
     */
    @TypedRoute.Post()
    @UseGuards(UserAuthGuard)
    async sendLetter(@User() user: UserAuthDto, @TypedBody() letterData: ICreateLetter): Promise<TryCatch<{ message:string, sentAt: Date },
        USER_NOT_FOUND | SEND_LETTER_ERROR >>{

        const createLetterData : CreateLetterDto = {
            senderId : user.id,
            receiverId : await this.userService.getUserIdByEmail(letterData.receiverEmail),
            title : letterData.title,
            content : letterData.content,
        }
        const letter = await this.letterService.sendLetter(createLetterData);
        return createResponseForm({
            message : "편지 발송에 성공하였습니다.",
            sentAt : letter.createdAt
        });
    }

    /**
     * @summary 내 받은 편지함 조회 API
     * @param user
     * @returns LetterWithUserDto[]
     */
    @TypedRoute.Get('receive')
    @UseGuards(UserAuthGuard)
    async getReceivedLetterList(@User() user: UserAuthDto) : Promise<Try<LetterWithUserDto[]>> {
        return createResponseForm(await this.letterService.getReceivedLetterListByReceiverId(user.id));
    }

    /**
     * @summary 내가 보낸 편지함 조회 API
     * @param user
     * @returns LetterWithUserDto[]
     */
    @TypedRoute.Get('send')
    @UseGuards(UserAuthGuard)
    async getSentLetterList(@User() user: UserAuthDto) : Promise<Try<LetterWithUserDto[]>> {
        return createResponseForm(await this.letterService.getSentLetterListBySenderId(user.id));
    }

    /**
     * @summary 특정 편지 조회 API
     * @param user
     * @param letterId
     * @returns LetterWithUserDto
     * @throws LETTER_NOT_FOUND
     * @throws FORBIDDEN_FOR_LETTER
     */
    @TypedRoute.Get(':letterId')
    @UseGuards(UserAuthGuard)
    async getLetter(@User() user: UserAuthDto, @TypedParam('letterId') letterId: number) : Promise<TryCatch<LetterWithUserDto,
        LETTER_NOT_FOUND | FORBIDDEN_FOR_LETTER>>{
        const letter = await this.letterService.getLetterByLetterId(letterId, user.id);
        if(!letter.readAt)
            try{
                await this.letterService.readLetter(letterId, user.id);
            }catch(e){}
        return createResponseForm(letter);
    }

    @TypedRoute.Put(':letterId/read')
    @UseGuards(UserAuthGuard)
    async readLetter(@User() user:UserAuthDto, @TypedParam('letterId') letterId: number) : Promise<TryCatch<{ message:string, readAt: Date },
        LETTER_NOT_FOUND | FORBIDDEN_FOR_LETTER | LETTER_ALREADY_READ>>{
        const letter = await this.letterService.readLetter(letterId, user.id);
        return createResponseForm({
            message : "편지를 읽음 처리 했습니다.",
            readAt : letter.readAt? letter.readAt : this.utilService.getCurrentDateInKorea()
        });
    }

}

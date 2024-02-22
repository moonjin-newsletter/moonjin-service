import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateLetterDto} from "./dto/CreateLetter.dto";
import {UtilService} from "../util/util.service";
import LetterDtoMapper from "./letterDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import {LetterDto} from "./dto/letter.dto";
import {UserService} from "../user/user.service";

@Injectable()
export class LetterService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
        private readonly userService: UserService
    ) {}


    /**
     * @summary 편지 발송 기능
     * @param createLetterData
     * @returns LetterDto
     * @throws SEND_LETTER_ERROR
     * @throws USER_NOT_FOUND
     */
    async sendLetter(createLetterData : CreateLetterDto) : Promise<LetterDto> {
        await this.userService.assertUserExist(createLetterData.receiverId);
        if(createLetterData.receiverId === createLetterData.senderId) throw ExceptionList.SEND_LETTER_ERROR;
        try {
            const letter = await this.prismaService.letter.create({
                data : {
                    ...createLetterData,
                    createdAt : this.utilService.getCurrentDateInKorea(),
                }
            });
            return LetterDtoMapper.letterToletterDto(letter);
        }catch (error) {
            console.error(error);
            throw ExceptionList.SEND_LETTER_ERROR;
        }
    }

}

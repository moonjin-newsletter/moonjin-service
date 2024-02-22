import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateLetterDto} from "./dto/CreateLetter.dto";
import {UtilService} from "../util/util.service";
import LetterDtoMapper from "./letterDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import {LetterDto} from "./dto/letter.dto";
import {UserService} from "../user/user.service";
import {LetterWithSender} from "./dto/letterWithUser.prisma";
import {LetterWithSenderDto} from "./dto/LetterWithSender.dto";

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

    /**
     * @summary 특정 유저의 편지함 조회
     * @param userId
     * @returns LetterWithSenderDto[]
     */
    async getLetterList(userId : number): Promise<LetterWithSenderDto[]>{
        const letterList : LetterWithSender[] = await this.prismaService.letter.findMany({
            where:{
                receiverId : userId
            },
            include : {
                sender : {
                    select : {
                        id : true,
                        nickname : true
                    }
                }
            },
            orderBy:{
                createdAt : 'desc'
            }
        });
        if(letterList.length === 0) return [];
        return letterList.map(letter => LetterDtoMapper.letterWithSenderToLetterWithSenderDto(letter));
    }
}

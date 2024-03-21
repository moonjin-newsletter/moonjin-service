import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {UtilService} from "../util/util.service";
import LetterDtoMapper from "./letterDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import {UserService} from "../user/user.service";
import { LetterWithUser} from "./prisma/letterWithUser.prisma";
import {CreateLetterDto, LetterDto, LetterWithUserDto} from "./dto";

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
     * @summary 특정 유저의 받은 편지함 조회
     * @param receiverId
     * @returns LetterWithUserDto[]
     */
    async getReceivedLetterListByReceiverId(receiverId : number): Promise<LetterWithUserDto[]>{
        const letterList : LetterWithUser[] = await this.prismaService.letter.findMany({
            where:{
                receiverId
            },
            include : {
                sender : {
                    select : {
                        id : true,
                        nickname : true
                    }
                },
                receiver : {
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
        return letterList.map(letter => LetterDtoMapper.letterWithUserToletterWithUserDto(letter));
    }

    /**
     * @summary 특정 유저의 받은 편지함 조회
     * @param senderId
     * @returns LetterWithUserDto[]
     */
    async getSentLetterListBySenderId(senderId : number): Promise<LetterWithUserDto[]>{
        const letterList : LetterWithUser[] = await this.prismaService.letter.findMany({
            where:{
                senderId,
            },
            include : {
                sender : {
                    select : {
                        id : true,
                        nickname : true
                    }
                },
                receiver : {
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
        return letterList.map(letter => LetterDtoMapper.letterWithUserToletterWithUserDto(letter));
    }


    /**
     * @summary 특정 편지 읽음 처리
     * @param letterId
     * @param userId
     * @returns LetterDto
     * @throws LETTER_UNAUTHORIZED
     * @throws LETTER_NOT_FOUND
     * @throws LETTER_ALREADY_READ
     */
    async readLetter(letterId: number, userId: number): Promise<LetterDto>{
        await this.assertUserIsReceiverOfLetter(letterId, userId, true);
        try {
            const letter   = await this.prismaService.letter.update({
                where:{
                    id : letterId
                },
                data:{
                    readAt : this.utilService.getCurrentDateInKorea()
                }
            });
            return LetterDtoMapper.letterToletterDto(letter);
        }catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * @summary 특정 유저가 특정 편지의 수신자인지 확인
     * @param letterId
     * @param userId
     * @param checkRead
     * @throws LETTER_NOT_FOUND
     * @throws LETTER_UNAUTHORIZED
     * @throws LETTER_ALREADY_READ
     */
    async assertUserIsReceiverOfLetter(letterId: number, userId: number, checkRead: boolean = false){
        const letter = await this.prismaService.letter.findUnique({
            where:{
                id : letterId
            }
        });
        if(!letter) throw ExceptionList.LETTER_NOT_FOUND;
        if(letter.receiverId !== userId) throw ExceptionList.LETTER_UNAUTHORIZED;
        if(checkRead && letter.readAt) throw ExceptionList.LETTER_ALREADY_READ;
    }
}

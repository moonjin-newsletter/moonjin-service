import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {UtilService} from "../util/util.service";
import LetterDtoMapper from "./letterDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import { LetterWithUser} from "./prisma/letterWithUser.prisma";
import {CreateLetterDto, LetterDto, LetterWithUserDto} from "./dto";

@Injectable()
export class LetterService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly utilService: UtilService,
    ) {}

    /**
     * @summary 편지 발송 기능
     * @param createLetterData
     * @returns LetterDto
     * @throws USER_NOT_FOUND
     * @throws SEND_LETTER_ERROR
     */
    async sendLetter(createLetterData : CreateLetterDto) : Promise<LetterDto> {
        if(createLetterData.senderId === createLetterData.receiverId) throw ExceptionList.SEND_LETTER_ERROR;
        try {
            const letter = await this.prismaService.letter.create({
                data : {
                    ...createLetterData,
                    createdAt : this.utilService.getCurrentDateInKorea(),
                }
            });
            return LetterDtoMapper.letterToLetterDto(letter);
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
                        nickname : true,
                        email : true,
                        writerInfo : {
                            select : {
                                moonjinId : true
                            }
                        }
                    }
                },
                receiver : {
                    select : {
                        id : true,
                        nickname : true,
                        email : true,
                        writerInfo : {
                            select : {
                                moonjinId : true
                            }
                        }
                    }
                }
            },
            orderBy:{
                createdAt : 'desc'
            }
        });
        return letterList.map(letter => LetterDtoMapper.letterWithUserToLetterWithUserDto(letter));
    }

    /**
     * @summary 특정 유저의 보낸 편지함 조회
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
                        nickname : true,
                        email : true,
                        writerInfo : {
                            select : {
                                moonjinId : true
                            }
                        }
                    }
                },
                receiver : {
                    select : {
                        id : true,
                        nickname : true,
                        email : true,
                        writerInfo : {
                            select : {
                                moonjinId : true
                            }
                        }
                    }
                }
            },
            orderBy:{
                createdAt : 'desc'
            }
        });
        return letterList.map(letter => LetterDtoMapper.letterWithUserToLetterWithUserDto(letter));
    }

    /**
     * @summary 편지 id로 조회
     * @param letterId
     * @param userId
     * @param onRead : 읽음 처리 시킬건 지
     * @returns LetterWithUserDto
     * @throws LETTER_NOT_FOUND
     * @throws FORBIDDEN_FOR_LETTER
     */
    async getLetterByLetterId(letterId: number, userId: number, onRead = false): Promise<LetterWithUserDto>{
        await this.assertUserCanAccessToLetter(letterId, userId);
        const letter: LetterWithUser|null = await this.prismaService.letter.findUnique({
            where:{
                id : letterId
            },
            include : {
                sender : {
                    select : {
                        id : true,
                        nickname : true,
                        email : true,
                        writerInfo : {
                            select : {
                                moonjinId : true
                            }
                        }
                    }
                },
                receiver : {
                    select : {
                        id : true,
                        nickname : true,
                        email : true,
                        writerInfo : {
                            select : {
                                moonjinId : true
                            }
                        }
                    }
                }
            },
        });
        if(!letter) throw ExceptionList.LETTER_NOT_FOUND;
        try{
            if(onRead && !letter.readAt)
                await this.readLetter(letterId, userId);
        }catch (error) {
            console.error(error);
        }
        return LetterDtoMapper.letterWithUserToLetterWithUserDto(letter);
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
        const letter = await this.assertUserCanAccessToLetter(letterId, userId);
        if(letter.readAt) throw ExceptionList.LETTER_ALREADY_READ;
        try {
            const letter   = await this.prismaService.letter.update({
                where:{
                    id : letterId
                },
                data:{
                    readAt : this.utilService.getCurrentDateInKorea()
                }
            });
            return LetterDtoMapper.letterToLetterDto(letter);
        }catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * @summary 특정 유저가 특정 편지에 접근 가능한지 확인
     * @param letterId
     * @param userId
     * @throws LETTER_NOT_FOUND
     * @throws FORBIDDEN_FOR_LETTER
     */
    async assertUserCanAccessToLetter(letterId: number, userId: number): Promise<LetterDto>{
        const letter = await this.prismaService.letter.findUnique({
            where:{
                id : letterId
            }
        });
        if(!letter) throw ExceptionList.LETTER_NOT_FOUND;
        if(letter.receiverId === userId || letter.senderId === userId)
            return LetterDtoMapper.letterToLetterDto(letter);
        throw ExceptionList.FORBIDDEN_FOR_LETTER;
    }
}

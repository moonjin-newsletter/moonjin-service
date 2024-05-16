import { Injectable } from '@nestjs/common';
import {WriterPublicCardDto} from "./dto";
import {WriterInfoWithUser} from "../user/prisma/writerInfoWithUser.prisma.type";
import {PrismaService} from "../prisma/prisma.service";
import UserDtoMapper from "../user/userDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";

@Injectable()
export class WriterService {
    constructor(
        private prismaService : PrismaService
    ) {}

    /**
     * moonjinId로 작가의 Public-Card를 가져오기.
     * @param moonjinId
     * @return WriterPublicCardDto
     * @throws USER_NOT_WRITER
     */
    async getWriterPublicCardByMoonjinId(moonjinId : string): Promise<WriterPublicCardDto>{
        try{
            const writer : WriterInfoWithUser = await this.prismaService.writerInfo.findUniqueOrThrow({
                where : {
                    moonjinId,
                    deleted : false,
                    user:{
                        deleted : false
                    }
                },
                include :{
                    user : true
                },
                relationLoadStrategy: 'join',
            })
            return {
                user : UserDtoMapper.UserToUserDto(writer.user),
                writerInfo : UserDtoMapper.WriterInfoToWriterInfoDto(writer)
            }
        }catch (error){
            console.error(error)
            throw ExceptionList.USER_NOT_WRITER;
        }
    }
}

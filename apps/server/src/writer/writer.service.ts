import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {WriterInfoWithUser} from "../user/prisma/writerInfoWithUser.prisma.type";

@Injectable()
export class WriterService {
    constructor(
       private readonly prismaService: PrismaService,
    ) {}

    /**
     * @summary 인기 작가 조회
     * @param take
     * @returns WriterInfoWithUser[]
     */
    async getPopularWriters(take : number): Promise<WriterInfoWithUser[]> {
        try{
            return await this.prismaService.writerInfo.findMany({
                take:take,
                include: {
                    user:true
                },
                orderBy:{
                    followerCount:'desc'
                }
            });
        }catch (error){
            return [];
        }
    }
}

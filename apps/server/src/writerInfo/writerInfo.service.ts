import { Injectable } from '@nestjs/common';
import {WriterPublicCardDto, ChangeWriterProfileDto} from "./dto";
import {WriterInfoWithUser} from "../user/prisma/writerInfoWithUser.prisma.type";
import {PrismaService} from "../prisma/prisma.service";
import UserDtoMapper from "../user/userDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import {UserDto} from "../user/dto";
import {UtilService} from "../util/util.service";
import {UserService} from "../user/user.service";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {WriterInfoDtoMapper} from "./writerInfoDtoMapper";

@Injectable()
export class WriterInfoService {
    constructor(
        private prismaService : PrismaService,
        private utilService : UtilService,
        private userService : UserService
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
                writerInfo : WriterInfoDtoMapper.WriterInfoToWriterInfoDto(writer)
            }
        }catch (error){
            console.error(error)
            throw ExceptionList.USER_NOT_WRITER;
        }
    }

    /**
     * @summary 작가 프로필 변경하기
     * @param userId
     * @param newWriterProfile
     * @returns UserDto
     * @throws PROFILE_CHANGE_ERROR
     * @throws NICKNAME_ALREADY_EXIST
     * @throws USER_NOT_WRITER
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     */
    async changeWriterProfile(userId: number, newWriterProfile: ChangeWriterProfileDto): Promise<UserDto> {
        if(this.utilService.isNullObject(newWriterProfile)) throw ExceptionList.PROFILE_CHANGE_ERROR;

        const {moonjinId,...newUserProfile} = newWriterProfile;
        if(!moonjinId) return this.userService.changeUserProfile(userId, newUserProfile);

        try{
            const writerInfoWithUser : WriterInfoWithUser = await this.prismaService.writerInfo.update({
                where: {
                    userId
                },
                data: {
                    moonjinId,
                    user: {
                        update: {
                            ...newUserProfile
                        }
                    }
                },
                include: {
                    user: true
                }
            })
            return UserDtoMapper.UserToUserDto(writerInfoWithUser.user);
        }catch (error){
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code == "P2002" && error.meta){
                    const errorField = (error.meta.target as string[])[0]
                    switch (errorField){
                        case "nickname":
                            throw ExceptionList.NICKNAME_ALREADY_EXIST;
                        case "moonjinId":
                            throw ExceptionList.MOONJIN_EMAIL_ALREADY_EXIST;
                        default:
                            throw ExceptionList.PROFILE_CHANGE_ERROR;
                    }
                }
            }
            throw ExceptionList.USER_NOT_WRITER;
        }
    }

    /**
     * @summary 해당 유저의 뉴스레터 수와 동기화
     * @param writerId
     * @throws USER_NOT_WRITER
     */
    async synchronizeNewsLetter(writerId: number){
        try{
            const newsletterCount = await this.prismaService.newsletter.count({
                where: {
                    post : {
                        writerId,
                        deleted : false
                    }
                }
            })
            await this.prismaService.writerInfo.update({
                where: {
                    userId: writerId
                },
                data: {
                    newsletterCount
                }
            })
        }catch (error){
            throw ExceptionList.USER_NOT_WRITER
        }
    }

    /**
     * @summary 작가 시리즈 수 동기화
     * @param userId
     * @returns void
     * @throws USER_NOT_WRITER
     */
    async synchronizeSeries(userId :number) {
        try{
            const seriesCount = await this.prismaService.series.count({
                where: {
                    writerId: userId,
                    deleted: false
                }
            })
            await this.prismaService.writerInfo.update({
                where: {
                    userId
                },
                data: {
                    seriesCount
                }
            })
        }catch (error){
            throw ExceptionList.USER_NOT_WRITER
        }
    }
}

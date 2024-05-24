import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {PrismaClientKnownRequestError} from '@prisma/client/runtime/library';
import {ExceptionList} from "../response/error/errorInstances";
import {UtilService} from "../util/util.service";
import {
    UserIdentityDto,
    UserDto,
    WriterDto,
    ChangeUserProfileDto
} from "./dto";
import {UserRoleEnum} from "../auth/enum/userRole.enum";
import { WriterInfoDto} from "../auth/dto";
import UserDtoMapper from "./userDtoMapper";
import {WriterInfoWithUser} from "./prisma/writerInfoWithUser.prisma.type";
import * as process from "process";
import {ChangeWriterProfileDto} from "./dto";
import {UserOrWriterDto} from "./dto/UserOrWriter.dto";

@Injectable()
export class UserService {
    constructor(
       private readonly prismaService: PrismaService,
       private readonly utilService: UtilService,
    ) {}

    /**
     * @summary 유저 ID로 작가 정보 가져오기
     * @param userIdList
     * @returns WriterInfoDto[]
     * @throws EMPTY_LIST_INPUT
     */
    async getWriterInfoListByUserIdList(userIdList : number[]) : Promise<WriterInfoDto[]> {
        if (userIdList.length === 0) throw ExceptionList.EMPTY_LIST_INPUT;
        const writerInfoList = await this.prismaService.writerInfo.findMany({
            where: {
                userId: {
                    in: userIdList
                },
                deleted: false,
            }
        });
        return writerInfoList.map(writerInfo => UserDtoMapper.WriterInfoToWriterInfoDto(writerInfo));
    }

    /**
     * @summary 유저 ID로 작가 정보 가져오기
     * @param writerId
     * @returns WriterInfoDto
     * @throws USER_NOT_WRITER
     */
    async getWriterInfoByUserId(writerId: number): Promise<WriterDto> {
        const writer : WriterInfoWithUser | null = await this.prismaService.writerInfo.findUnique({
            where : {
                userId : writerId,
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
        if(!writer) throw ExceptionList.USER_NOT_WRITER;
        return {
            user : UserDtoMapper.UserToUserDto(writer.user),
            writerInfo : UserDtoMapper.WriterInfoToWriterInfoDto(writer)
        }
    }

    /**
     * @summary 유저 ID로 유저의 기본 정보 가져오기
     * @param userIdList
     * @returns {userId, nickname}[]
     * @throws EMPTY_LIST_INPUT
     */
    async getUserIdentityDataListByUserIdList(userIdList : number[]) : Promise<UserIdentityDto[]> {
        if (userIdList.length === 0) throw ExceptionList.EMPTY_LIST_INPUT;
        return this.prismaService.user.findMany({
            where: {
                id : {
                    in : userIdList
                },
                deleted : false,
            },
            select : {
                id : true,
                nickname : true,
            }
        })
    }

    /**
     * @summary 유저의 데이터 가져오기 (작가, 일반 유저 구분)
     * @param userId
     * @param role
     * @returns UserDto & WriterInfoDto?
     * @throws USER_NOT_FOUND
     * @throws USER_NOT_WRITER
     */
    async getUserData(userId : number, role : UserRoleEnum):Promise<UserOrWriterDto> {
        if(role === UserRoleEnum.WRITER){
            const writer : WriterInfoWithUser | null = await this.prismaService.writerInfo.findUnique({
                where : {
                    userId,
                    deleted : false,
                },
                include :{
                    user : true
                },
                relationLoadStrategy: 'join',
            })
            if(!writer) throw ExceptionList.USER_NOT_WRITER;
            return UserDtoMapper.UserWithWriterInfoToUserAndWriterInfoDto(writer);
        }

        const user = await this.prismaService.user.findUnique({
            where : {
                id : userId,
                deleted : false,
            }
        })
        if(!user) throw ExceptionList.USER_NOT_FOUND;
        return {user : UserDtoMapper.UserToUserDto(user), writerInfo : null};
    }


    /**
     * @summary 해당 유저가 존재하는 지 확인
     * @param userId
     * @returns void
     * @throws USER_NOT_FOUND
     */
    async assertUserExistById(userId : number): Promise<void>{
        const user = await this.prismaService.user.findUnique({
            where : {
                id : userId,
                deleted : false,
            }
        })
        if(!user) throw ExceptionList.USER_NOT_FOUND;
    }

    /**
     * @summary 해당 작가가 존재하는 지 확인
     * @param moonjinId
     * @returns {userId, moonjinId}
     * @throws USER_NOT_WRITER
     */
    async assertWriterExistByMoonjinId(moonjinId: string): Promise<{userId: number, moonjinId :string}> {
        const writer = await this.prismaService.writerInfo.findUnique({
            where: {
                moonjinId
            }
        })
        if(!writer) throw ExceptionList.USER_NOT_FOUND;
        return {
            userId: writer.userId,
            moonjinId
        };
    }

    /**
     * @summary email로 userId 가져오기 (moonjinEmail도 가능)
     * @param email
     * @returns userId
     * @throws USER_NOT_FOUND
     */
    async getUserIdByEmail(email: string): Promise<number> {
        const moonjinDomain = process.env.MAILGUN_DOMAIN?? '@moonjin';

        if(email.includes(moonjinDomain)){
            const moonjinId = email.split('@')[0];
            const writer = await this.prismaService.writerInfo.findUnique({
                where: {
                    moonjinId
                }
            })
            if(!writer) throw ExceptionList.USER_NOT_FOUND;
            return writer.userId;
        }else{
            const user = await this.prismaService.user.findUnique({
                where: {
                    email
                }
            })
            if(!user) throw ExceptionList.USER_NOT_FOUND;
            return user.id;
        }
    }

    /**
     * @summary 유저 프로필 변경하기
     * @param userId
     * @param newUserProfile
     * @returns UserDto
     * @throws PROFILE_CHANGE_ERROR
     * @throws NICKNAME_ALREADY_EXIST
     * @throws USER_NOT_FOUND
     */
    async changeUserProfile(userId: number, newUserProfile: ChangeUserProfileDto): Promise<UserDto> {
        if(this.utilService.isNullObject(newUserProfile)) throw ExceptionList.PROFILE_CHANGE_ERROR;
        try {
            const user = await this.prismaService.user.update({
                where: {
                    id: userId
                },
                data: {
                    ...newUserProfile,
                }
            })
            return UserDtoMapper.UserToUserDto(user);
        }catch (error){
            if(error instanceof PrismaClientKnownRequestError){
                throw ExceptionList.NICKNAME_ALREADY_EXIST;
            }
            throw ExceptionList.USER_NOT_FOUND;
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
        if(!moonjinId) return this.changeUserProfile(userId, newUserProfile);

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
     * @summary 작가 뉴스레터 수 증가
     * @param userId
     * @param isIncrement
     * @returns void
     * @throws USER_NOT_WRITER
     */
    async synchronizeNewsLetter(userId : number, isIncrement: boolean): Promise<void> {
        try{
            const newsletterCount = isIncrement ? {
                increment: 1
            } : {
                decrement: 1
            };
            await this.prismaService.writerInfo.update({
                where: {
                    userId
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
     * @summary 작가 시리즈 수 증가
     * @param userId
     * @returns void
     * @throws USER_NOT_WRITER
     */
    async synchronizeSeries(userId :number) {
        try{
            const seriesCount = await this.prismaService.series.count({
                where: {
                    writerId: userId
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

    /**
     * @summary 작가 정보 삭제하기
     * @param writerId
     * @returns void
     */
    async deleteWriterById(writerId: number): Promise<void> {
        await this.prismaService.writerInfo.delete({
            where: {
                userId: writerId
            },
        })
    }

    /**
     * @summary 유저 role 업데이트
     * @param userId
     * @param role
     * @returns void
     * @throws USER_NOT_FOUND
     */
    async updateUserRole(userId: number,role: UserRoleEnum): Promise<void> {
        await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                role
            }
        })
    }
}

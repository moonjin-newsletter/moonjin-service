import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ExternalFollowerDto} from "../user/dto";
import {AuthValidationService} from "../auth/auth.validation.service";
import {UtilService} from "../util/util.service";
import UserDtoMapper from "../user/userDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";
import {UserService} from "../user/user.service";

@Injectable()
export class SubscribeService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authValidationService: AuthValidationService,
        private readonly utilService: UtilService,
        private readonly userService:UserService
    ) {}

    /**
     * @summary 외부 구독자 추가하기
     * @param writerId
     * @param followerEmail
     * @returns ExternalFollowerDto
     * @throws EMAIL_ALREADY_EXIST
     * @throws FOLLOWER_ALREADY_EXIST
     */
    async addExternalSubscriberByEmail(writerId: number, followerEmail: string): Promise<ExternalFollowerDto> {
        await this.authValidationService.assertEmailUnique(followerEmail);
        try{
            const externalFollow = await this.prismaService.externalFollow.create({
                data: {
                    writerId,
                    followerEmail,
                    createdAt: this.utilService.getCurrentDateInKorea()
                }
            })
            return UserDtoMapper.ExternalFollowerToExternalFollowerDto(externalFollow)
        }catch (error){
            console.log(error);
            throw ExceptionList.FOLLOWER_ALREADY_EXIST;
        }
    }

    /**
     * @summary 작가를 팔로우
     * @param followerId
     * @param writerId
     * @returns void
     * @throws FOLLOW_MYSELF_ERROR
     * @throws FOLLOW_ALREADY_ERROR
     * @throws USER_NOT_WRITER
     */
    async followWriter(followerId : number, writerId : number): Promise<void> {
        if(followerId === writerId) throw ExceptionList.FOLLOW_MYSELF_ERROR;
        await this.authValidationService.assertWriter(writerId);
        try {
            await this.prismaService.subscribe.create({
                data: {
                    followerId,
                    writerId,
                    createdAt : this.utilService.getCurrentDateInKorea()
                }
            });
            await this.userService.synchronizeFollower(writerId);
        }catch (error) {
            throw ExceptionList.FOLLOW_ALREADY_ERROR;
        }
    }
}

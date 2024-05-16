import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ExternalFollowerDto} from "../user/dto";
import {AuthValidationService} from "../auth/auth.validation.service";
import {UtilService} from "../util/util.service";
import UserDtoMapper from "../user/userDtoMapper";
import {ExceptionList} from "../response/error/errorInstances";

@Injectable()
export class SubscribeService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authValidationService: AuthValidationService,
        private readonly utilService: UtilService
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

}

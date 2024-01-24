import { Injectable } from '@nestjs/common';
import {AuthValidationService} from "../auth/auth.validation.service";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(
       private readonly authValidationService : AuthValidationService,
       private readonly prismaService: PrismaService,
    ) {}

    /**
     * @summary 작가를 팔로우
     * @param followerId
     * @param writerId
     * @throws USER_NOT_WRITER
     */
    async followWriter(followerId : number, writerId : number): Promise<void> {
        await this.authValidationService.assertWriter(writerId);
        await this.prismaService.follow.create({
            data: {
                followerId,
                writerId
            }
        });
    }
}

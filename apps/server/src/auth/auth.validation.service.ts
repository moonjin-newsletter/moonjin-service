import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ExceptionList} from "../response/error/errorInstances";
import {UserUniqueDataDto} from "./dto/userUniqueData.dto";

@Injectable()
export class AuthValidationService {
    constructor(private readonly prismaService: PrismaService) {}

    /**
     * @summary user의 가입 정보 중 중복되는 것 에러 발생
     * @param userData
     * @throws EMAIL_ALREADY_EXIST
     * @throws NICKNAME_ALREADY_EXIST
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     */
    async assertSignupDataUnique(userData : UserUniqueDataDto){
        await this.assertEmailUnique(userData.email)
        await this.assertNicknameUnique(userData.nickname)
        if(userData.moonjinEmail)
            await this.assertMoonjinEmailUnique(userData.moonjinEmail)
    }

    /**
     * @summary email 이 unique 한지 확인
     * @param email
     * @throws EMAIL_ALREADY_EXIST
     */
    async assertEmailUnique(email : string) : Promise<void>{
        const user = await this.prismaService.user.findUnique({
            where:{
                email
            }
        })
        if(user) throw ExceptionList.EMAIL_ALREADY_EXIST;
    }
    /**
     * @summary nickname이 unique 한지 확인
     * @param nickname
     * @throws NICKNAME_ALREADY_EXIST
     */
    async assertNicknameUnique(nickname : string) : Promise<void>{
        const user = await this.prismaService.user.findUnique({
            where:{
                nickname,
                deleted : false
            }
        })
        if(user) throw ExceptionList.NICKNAME_ALREADY_EXIST;
    }
    /**
     * @summary moonjinEmail이 unique 한지 확인
     * @param moonjinId
     * @throws MOONJIN_EMAIL_ALREADY_EXIST
     */
    async assertMoonjinEmailUnique(moonjinId : string) : Promise<void>{
        const user = await this.prismaService.writer.findUnique({
            where:{
                moonjinId,
                deleted : false
            }
        })
        if(user) throw ExceptionList.MOONJIN_EMAIL_ALREADY_EXIST;
    }

}

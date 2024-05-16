import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ExceptionList} from "../response/error/errorInstances";
import {UserUniqueDataDto} from "./dto";

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
    async assertSignupDataUnique(userData : UserUniqueDataDto): Promise<void>{
        await this.assertEmailUnique(userData.email)
        await this.assertNicknameUnique(userData.nickname)
        if(userData.moonjinEmail)
            await this.assertMoonjinIdUnique(userData.moonjinEmail)
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
    async assertMoonjinIdUnique(moonjinId : string) : Promise<void>{
        const user = await this.prismaService.writerInfo.findUnique({
            where:{
                moonjinId,
                deleted : false
            }
        })
        if(user) throw ExceptionList.MOONJIN_EMAIL_ALREADY_EXIST;
    }


    /**
     * @summary 작가인지 확인
     * @param userId
     * @throws USER_NOT_WRITER
     */
    async assertWriter(userId : number) {
        const user = await this.prismaService.writerInfo.findUnique({
            where: {
                userId: userId
            }
        });
        if (!user) {
            throw ExceptionList.USER_NOT_WRITER
        }
    }

    /**
     * @summary 작가가 아닌지 확인. 작가면 에러
     * @param userId
     * @throws WRITER_SIGNUP_ERROR
     */
    async assertUserNotWriter(userId : number){
        const user = await this.prismaService.writerInfo.findUnique({
            where: {
                userId: userId
            }
        });
        if (user) {
            throw ExceptionList.WRITER_SIGNUP_ERROR
        }
    }
}

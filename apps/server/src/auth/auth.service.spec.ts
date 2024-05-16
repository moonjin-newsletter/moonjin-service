import { Test } from '@nestjs/testing';
import {AuthService} from "./auth.service";
import {PrismaModule} from "../prisma/prisma.module";
import {OauthService} from "./oauth.service";
import {AuthValidationService} from "./auth.validation.service";
import {PrismaService} from "../prisma/prisma.service";
import {UtilModule} from "../util/util.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {HttpModule} from "@nestjs/axios";
import {SignupDataDto,EnrollWriterDto} from "./dto";
import {UserRoleEnum} from "./enum/userRole.enum";
import { JwtModule } from '@nestjs/jwt';
import typia from 'typia';
import {JwtUtilService} from "./jwtUtil.service";

describe('인증 서비스', () => {
    let authService: AuthService;
    let authValidationService : AuthValidationService;
    let prismaService: PrismaService
    let jwtUtilService : JwtUtilService

    beforeEach(async () => {
        const authModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '../../.env.dev.local',
                }),
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (config: ConfigService) => ({
                        secret: config.get<string>('JWT_SECRET'),
                    }),
                }),
                HttpModule,
                PrismaModule,
                UtilModule
            ],
            providers: [AuthService, OauthService, AuthValidationService]
        }).compile();

        authService = authModule.get<AuthService>(AuthService);
        authValidationService = authModule.get<AuthValidationService>(AuthValidationService);
        prismaService = authModule.get<PrismaService>(PrismaService);
        jwtUtilService = authModule.get<JwtUtilService>(JwtUtilService);
    });

    describe("유효성 검사", () => {
        it("이메일 중복 검사", async () => {
            const email = "test@moonjin.site"
            const sameEmail = email;

            interface IPayload {
                where : {
                    email : string
                }
            }
            const existEmailList: string[] = []
            prismaService.user.findUnique = jest.fn().mockImplementation(async (payload : IPayload) => {
                if(existEmailList.includes(payload.where.email)) return "exist";
                else{
                    existEmailList.push(payload.where.email)
                    return null;
                }
            })
            await authValidationService.assertEmailUnique(email);
            await expect(authValidationService.assertEmailUnique(sameEmail)).rejects.toThrow();
        })
    })

    describe("인증 서비스", () => {
        it("로컬 회원가입", async () => {
            // given
            interface ICreateUserPayload {
                data : {
                    email : string,
                    nickname : string,
                    password : string
                }
            }
            const userEmailList : Record<string, boolean> = {}
            const userNicknameList : Record<string, boolean> = {}
            let numberOfUser = 0;
            prismaService.user.create = jest.fn().mockImplementation(async (payload : ICreateUserPayload) => {
                if(userEmailList[payload.data.email]) throw "email already exist"
                if(userNicknameList[payload.data.nickname]) throw "nickname already exist"
                userEmailList[payload.data.email] = true;
                userNicknameList[payload.data.nickname] = true;
                return {
                    id : ++numberOfUser,
                    email : payload.data.email,
                    nickname : payload.data.nickname,
                    password : payload.data.password,
                    role : UserRoleEnum.USER,
                    status : true,
                    deleted : false,
                    createdAt : new Date(),
                    deletedAt : null,
                }
            } )
            const userMoonjinIdList : Record<string, boolean> = {}
            let numberOfWriter = 0;
            authService.enrollWriter = jest.fn().mockImplementation(async (writerSignupData : EnrollWriterDto) => {
                if(userMoonjinIdList[writerSignupData.moonjinId]) throw "moonjinId already exist"
                userMoonjinIdList[writerSignupData.moonjinId] = true;
                return {
                    id: ++numberOfWriter,
                    userId : writerSignupData.userId,
                    moonjinEmail: writerSignupData.moonjinId + "@" + "moonjin.site",
                    description: "test",
                    newsletterCount: 0,
                    seriesCount: 0,
                    followerCount: 0,
                }
            })

            //when
            const readerSignupData :SignupDataDto = {
                email : "reader@moonjin.site",
                nickname : "reader",
                hashedPassword : "test12test12test12test12",
                role : UserRoleEnum.USER
            }
            const writerSignupData : SignupDataDto = {
                email : "subscribe@moonjin.site",
                nickname : "writer",
                hashedPassword : "test12test12test12test12",
                role : UserRoleEnum.WRITER,
                moonjinId : "writer1"
            }
            const reader = await authService.localUserSignup(readerSignupData);
            const writer = await authService.localUserSignup(writerSignupData);

            //then
            expect(reader.email).toEqual(readerSignupData.email);
            await expect(authService.localUserSignup(readerSignupData)).rejects.toThrow()
            expect(writer.email).toEqual(writerSignupData.email);
            await expect(authService.localUserSignup(writerSignupData)).rejects.toThrow()
        })
    })

    describe("쿠키", () => {
        it("쿠키에서 토큰 가져오기", () => {
            const token = jwtUtilService.getTokenFromCookie(['testCookie=1234', 'NotTestCookie=4321'], 'testCookie');
            expect(token).toBe('1234');
        })

        it("쿠키에 찾는 토큰이 없는 경우", () => {
            expect(() => jwtUtilService.getTokenFromCookie(['testCookie=1234', 'NotTestCookie=4321'], 'notExistCookie')).toThrow();
        })

        it("JWT 쿠키 생성 및 정보 가져오기" ,() => {
            interface payloadType {
                nickname : string,
                email : string,
                id : number,
            }
            const payload = typia.random<payloadType>()
            const jwtToken = jwtUtilService.generateJwtToken(payload);
            const {iat,exp,...dataFromJwtToken} = jwtUtilService.getDataFromJwtToken<payloadType>(jwtToken);
            expect(dataFromJwtToken).toEqual(payload);
        })

    })

});
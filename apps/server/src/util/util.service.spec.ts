import { Test } from '@nestjs/testing';
import {UtilService} from "./util.service";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import typia from "typia";

describe('유틸 서비스', () => {
    let utilService: UtilService;

    beforeEach(async () => {
        const utilModule = await Test.createTestingModule({
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
                })
            ],
            providers: [UtilService],
            exports: [UtilService]
        }).compile();
        utilService = utilModule.get<UtilService>(UtilService);
    });

    describe('해시', () => {
        it("해시 비교", () => {
            const inputString = 'test';
            const hashedString = utilService.getHashCode(inputString);
            expect(utilService.compareHash(inputString, hashedString)).toBe(true);
        });
    });

    describe("쿠키", () => {
        it("쿠키에서 토큰 가져오기", () => {
            const token = utilService.getTokenFromCookie(['testCookie=1234', 'NotTestCookie=4321'], 'testCookie');
            expect(token).toBe('1234');
        })

        it("쿠키에 찾는 토큰이 없는 경우", () => {
            expect(() => utilService.getTokenFromCookie(['testCookie=1234', 'NotTestCookie=4321'], 'notExistCookie')).toThrow();
        })

        it("JWT 쿠키 생성 및 정보 가져오기" ,() => {
           interface payloadType {
                nickname : string,
                email : string,
                id : number,
            }
            const payload = typia.random<payloadType>()
            const jwtToken = utilService.generateJwtToken(payload);
            const {iat,exp,...dataFromJwtToken} = utilService.getDataFromJwtToken<{iat:number, exp : number} & payloadType>(jwtToken);
            expect(dataFromJwtToken).toEqual(payload);
        })

    })
});
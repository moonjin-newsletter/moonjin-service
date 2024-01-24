import { Test } from '@nestjs/testing';
import {UtilService} from "./util.service";

describe('유틸 서비스', () => {
    let utilService: UtilService;

    beforeEach(async () => {
        const utilModule = await Test.createTestingModule({
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
});
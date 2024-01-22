import {Test} from "@nestjs/testing";
import typia from "typia";
import {PostService} from "./post.service";
import {PostController} from "./post.controller";
import {ICreatePost} from "./api-types/ICreatePost";

describe('POST 컨트롤러', () => {
    let postController : PostController;

    beforeEach(async () => {
        const postModule = await Test.createTestingModule({
            providers: [PostService],
            controllers: [PostController]
        }).compile();
        postController = postModule.get<PostController>(PostController);
    });

    describe('게시글 생성', () => {
        it("게시글 생성", async () => {
            const postData = typia.random<ICreatePost>();
            expect(await postController.createPost(postData)).toBe(postData)
        })
    })


    // describe("쿠키", () => {
    //     it("쿠키에서 토큰 가져오기", () => {
    //         const token = utilService.getTokenFromCookie(['testCookie=1234', 'NotTestCookie=4321'], 'testCookie');
    //         expect(token).toBe('1234');
    //     })
    //
    //     it("쿠키에 찾는 토큰이 없는 경우", () => {
    //         expect(() => utilService.getTokenFromCookie(['testCookie=1234', 'NotTestCookie=4321'], 'notExistCookie')).toThrow();
    //     })
    //
    //     it("JWT 쿠키 생성 및 정보 가져오기" ,() => {
    //         interface payloadType {
    //             nickname : string,
    //             email : string,
    //             id : number,
    //         }
    //         const payload = typia.random<payloadType>()
    //         const jwtToken = utilService.generateJwtToken(payload);
    //         const {iat,exp,...dataFromJwtToken} = utilService.getDataFromJwtToken<{iat:number, exp : number} & payloadType>(jwtToken);
    //         expect(dataFromJwtToken).toEqual(payload);
    //     })
    //
    // })
});
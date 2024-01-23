import {Test} from "@nestjs/testing";
import typia from "typia";
import {PostService} from "./post.service";
import {PostController} from "./post.controller";
import {ICreatePost} from "./api-types/ICreatePost";
import {PrismaModule} from "../prisma/prisma.module";

describe('POST 컨트롤러', () => {
    let postController : PostController;
    // let postService : PostService;

    beforeEach(async () => {
        const postModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [PostService],
            controllers: [PostController]
        }).compile();
        // postService = postModule.get<PostService>(PostService);
        postController = postModule.get<PostController>(PostController);
    });

    describe('게시글 생성', () => {
        it("게시글 생성", async () => {
            const postData = typia.random<ICreatePost>();
            postData.seriesId = 0
            postData.status = true
            const responseData = await postController.createPost(postData)
            expect(responseData.data).toBe(postData)
        })
    })
});
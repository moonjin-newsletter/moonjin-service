import {Prisma} from "@prisma/client";

const stampedPost = Prisma.validator<Prisma.StampDefaultArgs>()({
    include : {
        post: true,
    }
})
export type StampedPost = Prisma.StampGetPayload<typeof stampedPost>;
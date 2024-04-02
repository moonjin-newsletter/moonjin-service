import {Prisma} from "@prisma/client";

const followingWriterInfoWithUser = Prisma.validator<Prisma.FollowDefaultArgs>()({
    include: {
        writerInfo: {
            include : {
                user: true
            }
        }
    },
})

export type FollowingWriterInfoWithUser = Prisma.FollowGetPayload<typeof followingWriterInfoWithUser>;
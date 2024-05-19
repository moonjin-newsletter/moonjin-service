import {Prisma} from "@prisma/client";

const followingWriterInfoWithUser = Prisma.validator<Prisma.SubscribeDefaultArgs>()({
    include: {
        writerInfo: {
            include : {
                user: true
            }
        }
    },
})

export type FollowingWriterInfoWithUser = Prisma.SubscribeGetPayload<typeof followingWriterInfoWithUser>;
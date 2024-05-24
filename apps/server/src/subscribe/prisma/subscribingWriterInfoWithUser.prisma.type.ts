import {Prisma} from "@prisma/client";

const subscribingWriterInfoWithUser = Prisma.validator<Prisma.SubscribeDefaultArgs>()({
    include: {
        writerInfo: {
            include : {
                user: true
            }
        }
    },
})

export type SubscribingWriterInfoWithUser = Prisma.SubscribeGetPayload<typeof subscribingWriterInfoWithUser>;
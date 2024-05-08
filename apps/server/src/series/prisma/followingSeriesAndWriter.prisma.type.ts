import {Prisma} from "@prisma/client";

const followingSeriesWithWriter = Prisma.validator<Prisma.SeriesDefaultArgs>()({
    include: {
        writerInfo: {
            include: {
                user: true
            }
        }
    }
})

export type FollowingSeriesWithWriter = Prisma.SeriesGetPayload<typeof followingSeriesWithWriter>;
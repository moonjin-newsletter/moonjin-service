import {Prisma} from "@prisma/client";

const seriesWithWriter = Prisma.validator<Prisma.SeriesDefaultArgs>()({
    include: {
        writerInfo: {
            include: {
                user: true
            }
        }
    }
})

export type SeriesWithWriter = Prisma.SeriesGetPayload<typeof seriesWithWriter>;
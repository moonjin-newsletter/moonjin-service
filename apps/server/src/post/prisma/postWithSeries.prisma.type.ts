import {Prisma} from "@prisma/client";

const postWithSeries = Prisma.validator<Prisma.PostDefaultArgs>()({
    include: {
        series : true,
    },
})
export type PostWithSeries = Prisma.PostGetPayload<typeof postWithSeries>;
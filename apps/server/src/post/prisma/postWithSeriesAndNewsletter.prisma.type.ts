import {Prisma} from "@prisma/client";

const postWithSeriesAndNewsletter = Prisma.validator<Prisma.PostDefaultArgs>()({
    include: {
        series : true,
        newsletter: {
            orderBy : {
                sentAt : 'desc'
            }
        }
    },
})
export type PostWithSeriesAndNewsletter = Prisma.PostGetPayload<typeof postWithSeriesAndNewsletter>;
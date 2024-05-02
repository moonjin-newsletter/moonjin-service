import {Prisma} from "@prisma/client";

const postWithContentAndSeries = Prisma.validator<Prisma.PostContentDefaultArgs>()({
    include:{
        post: {
            include:{
                series: true
            }
        }
    },
})
export type PostWithContentAndSeries = Prisma.PostContentGetPayload<typeof postWithContentAndSeries>;
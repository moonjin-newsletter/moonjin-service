import {Prisma} from "@prisma/client";

const postWithSeriesAndWriterUser = Prisma.validator<Prisma.PostDefaultArgs>()({
    include:{
        series : true,
        writerInfo : {
            include : {
                user : true
            }
        }
    },
})
export type PostWithSeriesAndWriterUser = Prisma.PostGetPayload<typeof postWithSeriesAndWriterUser>;
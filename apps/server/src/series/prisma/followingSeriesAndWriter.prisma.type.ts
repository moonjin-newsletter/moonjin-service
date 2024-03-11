import {Prisma} from "@prisma/client";

const followingSeriesAndWriter = Prisma.validator<Prisma.FollowDefaultArgs>()({
    include : {
        writerInfo: {
            include: {
                series: {
                    where: {
                        deleted: false,
                        releasedAt:{
                            not : null
                        }
                    }
                },
                user: true
            }
        }
    }
})

export type FollowingSeriesAndWriter = Prisma.FollowGetPayload<typeof followingSeriesAndWriter>;
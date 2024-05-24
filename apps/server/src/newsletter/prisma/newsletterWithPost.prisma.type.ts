import {Prisma} from "@prisma/client";

const newsletterWithPostAndSeriesAndWriterUser = Prisma.validator<Prisma.NewsletterInWebDefaultArgs>()({
    include:{
        newsletter :{
            include: {
                post : {
                    include : {
                        writerInfo : {
                            include : {
                                user : true
                            }
                        },
                        series : true
                    }
                }
            }
        }
    },
})
export type NewsletterWithPostAndSeriesAndWriterUser = Prisma.NewsletterInWebGetPayload<typeof newsletterWithPostAndSeriesAndWriterUser>;
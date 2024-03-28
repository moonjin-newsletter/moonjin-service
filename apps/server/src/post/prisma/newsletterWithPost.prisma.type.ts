import {Prisma} from "@prisma/client";

const newsletterWithPostAndSeriesAndWriterUser = Prisma.validator<Prisma.NewsletterDefaultArgs>()({
    select : {
        sentAt : true,
        post : {
            include : {
                writerInfo : {
                    include : {
                        user : true
                    }
                },
                series : true
            },
        },
    },
})
export type NewsletterWithPostAndSeriesAndWriterUser = Prisma.NewsletterGetPayload<typeof newsletterWithPostAndSeriesAndWriterUser>;
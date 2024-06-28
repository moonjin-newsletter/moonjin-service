import {Prisma} from "@prisma/client";

const newsletterWithPostWithWriterAndSeries = Prisma.validator<Prisma.NewsletterDefaultArgs>()({
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
        },
    },
})
export type NewsletterWithPostWithWriterAndSeries = Prisma.NewsletterGetPayload<typeof newsletterWithPostWithWriterAndSeries>;
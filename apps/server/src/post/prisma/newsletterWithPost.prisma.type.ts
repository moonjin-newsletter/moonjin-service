import {Prisma} from "@prisma/client";

const newsletterWithPostAndWriterUser = Prisma.validator<Prisma.NewsletterDefaultArgs>()({
    select : {
        sentAt : true,
        post : {
            include : {
                writerInfo : {
                    select : {
                        user : {
                            select : {
                                id : true,
                                nickname : true,
                            }
                        }
                    }
                }
            }
        }
    },
})
export type NewsletterWithPostAndWriterUser = Prisma.NewsletterGetPayload<typeof newsletterWithPostAndWriterUser>;
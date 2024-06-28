import {Prisma} from "@prisma/client";


const newsletterWithPostAndContentAndWriter = Prisma.validator<Prisma.NewsletterDefaultArgs>()({
    include: {
        post : {
            include : {
                series : true,
                writerInfo : {
                    include: {
                        user: true
                    }
                }
            }
        },
        postContent : true,
    }
})

export type NewsletterWithPostAndContentAndWriter = Prisma.NewsletterGetPayload<typeof newsletterWithPostAndContentAndWriter>;
import {Prisma} from "@prisma/client";


const webNewsletterWithNewsletterWithPost = Prisma.validator<Prisma.WebNewsletterDefaultArgs>()({
    include:{
        newsletter: {
            include : {
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

export type WebNewsletterWithNewsletterWithPost = Prisma.WebNewsletterGetPayload<typeof webNewsletterWithNewsletterWithPost>;
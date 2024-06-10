import {Prisma} from "@prisma/client";
import {SendMailEventsEnum} from "../../mail/enum/sendMailEvents.enum";

const sentNewsletterWithCounts = Prisma.validator<Prisma.NewsletterDefaultArgs>()({
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
        _count : {
            select : {
                newsletterInMail : true,
                newsletterAnalytics : {
                    where : {
                        event : SendMailEventsEnum.delivered
                    }
                }
            },
        }
    },
})
export type SentNewsletterWithCounts = Prisma.NewsletterGetPayload<typeof sentNewsletterWithCounts>;
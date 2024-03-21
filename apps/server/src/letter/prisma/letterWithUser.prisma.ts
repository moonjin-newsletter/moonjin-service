import {Prisma} from "@prisma/client";

const letterWithUser = Prisma.validator<Prisma.LetterDefaultArgs>()({
    include : {
        sender : {
            select : {
                id : true,
                nickname : true,
                email : true,
                writerInfo : {
                    select : {
                        moonjinId : true
                    }
                }
            }
        },
        receiver : {
            select : {
                id : true,
                nickname : true,
                email : true,
                writerInfo : {
                    select : {
                        moonjinId : true
                    }
                }
            }
        }
    },
})
export type LetterWithUser = Prisma.LetterGetPayload<typeof letterWithUser>;
import {Prisma} from "@prisma/client";

const letterWithUser = Prisma.validator<Prisma.LetterDefaultArgs>()({
    include : {
        sender : {
            select : {
                id : true,
                nickname : true
            }
        },
        receiver : {
            select : {
                id : true,
                nickname : true
            }
        }
    }
})
export type LetterWithUser = Prisma.LetterGetPayload<typeof letterWithUser>;
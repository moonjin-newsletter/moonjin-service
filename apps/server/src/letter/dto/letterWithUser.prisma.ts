import {Prisma} from "@prisma/client";

const letterWithSender = Prisma.validator<Prisma.LetterDefaultArgs>()({
    include : {
        sender : {
            select : {
                id : true,
                nickname : true
            }
        }
    }
})
export type LetterWithSender = Prisma.LetterGetPayload<typeof letterWithSender>;
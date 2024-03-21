import {Prisma} from "@prisma/client";

const letterWithReceiver = Prisma.validator<Prisma.LetterDefaultArgs>()({
    include : {
        receiver : {
            select : {
                id : true,
                nickname : true
            }
        }
    }
})
export type LetterWithReceiver = Prisma.LetterGetPayload<typeof letterWithReceiver>;
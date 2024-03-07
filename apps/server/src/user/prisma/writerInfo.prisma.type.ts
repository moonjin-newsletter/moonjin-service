import {Prisma} from "@prisma/client";

const writerInfoWithUser = Prisma.validator<Prisma.WriterInfoDefaultArgs>()({
    include : {
        user : true
    }
})

export type WriterInfoWithUser = Prisma.WriterInfoGetPayload<typeof writerInfoWithUser>;
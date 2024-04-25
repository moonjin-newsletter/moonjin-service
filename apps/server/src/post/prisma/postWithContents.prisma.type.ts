import {Prisma} from "@prisma/client";

const postWithContents = Prisma.validator<Prisma.PostDefaultArgs>()({
    include:{
        postContent:{
            orderBy:{
                createdAt : 'desc'
            }
        }
    },
})
export type PostWithContents = Prisma.PostGetPayload<typeof postWithContents>;
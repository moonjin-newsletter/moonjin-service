// @ts-ignore
import {Prisma} from "@prisma/client";

export type UserWithWriterInfo = Prisma.UserGetPayload<{include : {writerInfo: true}}>
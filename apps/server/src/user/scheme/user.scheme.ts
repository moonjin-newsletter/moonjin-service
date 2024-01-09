// @ts-ignore
import {Prisma} from "@prisma/client";

export type UserWithWriterInfo = Prisma.UserGetPayload<{include : {writerInfo: true}}>
export type UserWithOauth = Prisma.UserGetPayload<{ include : { oauth : true } }>
export type OauthWithUser = Prisma.OauthGetPayload<{ include : {user: true} }>
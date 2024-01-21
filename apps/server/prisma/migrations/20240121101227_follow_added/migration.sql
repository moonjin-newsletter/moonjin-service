/*
  Warnings:

  - You are about to drop the `WriterInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Series" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "WriterInfo";

-- CreateTable
CREATE TABLE "Writer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "moonjinId" VARCHAR(32) NOT NULL,
    "description" VARCHAR(256) NOT NULL DEFAULT '',
    "newsletterCount" INTEGER NOT NULL DEFAULT 0,
    "seriesCount" INTEGER NOT NULL DEFAULT 0,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Writer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "followerId" INTEGER NOT NULL,
    "writerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Writer_userId_key" ON "Writer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Writer_moonjinId_key" ON "Writer"("moonjinId");

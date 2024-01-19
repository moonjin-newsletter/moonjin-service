/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Oauth" DROP CONSTRAINT "Oauth_userId_fkey";

-- DropForeignKey
ALTER TABLE "WriterInfo" DROP CONSTRAINT "WriterInfo_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deletedAt",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "WriterInfo" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "description" VARCHAR(256),
ADD COLUMN     "newsletterCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "seriesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "subscriberCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(32) NOT NULL,
    "writerId" INTEGER NOT NULL,
    "category" CHAR(16) NOT NULL,
    "cover" VARCHAR(128),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(32) NOT NULL,
    "description" VARCHAR(256),
    "writerId" INTEGER NOT NULL,
    "category" CHAR(16) NOT NULL,
    "cover" VARCHAR(128),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_writerId_key" ON "Post"("writerId");

-- CreateIndex
CREATE UNIQUE INDEX "Series_writerId_key" ON "Series"("writerId");

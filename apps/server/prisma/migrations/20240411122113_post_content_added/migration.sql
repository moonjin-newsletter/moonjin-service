/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `User` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `PostContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `PostContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content";

-- AlterTable
ALTER TABLE "PostContent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "postId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "WriterInfo" ADD COLUMN     "description" VARCHAR(256) NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "PostContent_postId_idx" ON "PostContent"("postId");

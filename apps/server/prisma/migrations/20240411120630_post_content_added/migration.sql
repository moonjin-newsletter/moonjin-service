/*
  Warnings:

  - The `content` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
ADD COLUMN     "content" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "PostContent" (
    "id" SERIAL NOT NULL,
    "content" JSONB NOT NULL,

    CONSTRAINT "PostContent_pkey" PRIMARY KEY ("id")
);

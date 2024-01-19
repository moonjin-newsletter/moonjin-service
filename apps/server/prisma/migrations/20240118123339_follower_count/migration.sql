/*
  Warnings:

  - You are about to drop the column `subscriberCount` on the `WriterInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WriterInfo" DROP COLUMN "subscriberCount",
ADD COLUMN     "followerCount" INTEGER NOT NULL DEFAULT 0;

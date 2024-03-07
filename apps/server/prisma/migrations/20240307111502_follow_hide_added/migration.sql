/*
  Warnings:

  - You are about to drop the column `deletedByWriter` on the `Follow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "deletedByWriter",
ADD COLUMN     "hide" BOOLEAN NOT NULL DEFAULT false;

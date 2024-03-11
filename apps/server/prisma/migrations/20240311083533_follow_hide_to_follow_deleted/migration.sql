/*
  Warnings:

  - You are about to drop the column `hide` on the `Follow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "hide",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

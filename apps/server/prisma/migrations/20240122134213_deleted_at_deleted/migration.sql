/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Series` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "deletedAt",
ADD COLUMN     "releasedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Series" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deletedAt";

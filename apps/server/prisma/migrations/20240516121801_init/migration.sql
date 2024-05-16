/*
  Warnings:

  - You are about to drop the column `uuid` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_uuid_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "uuid";

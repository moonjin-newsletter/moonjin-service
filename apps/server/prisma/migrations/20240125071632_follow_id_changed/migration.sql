/*
  Warnings:

  - The primary key for the `Follow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Follow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId", "writerId");

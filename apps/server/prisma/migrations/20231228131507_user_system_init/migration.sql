/*
  Warnings:

  - The primary key for the `Oauth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Oauth` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE "Oauth" DROP CONSTRAINT "Oauth_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(64),
ADD CONSTRAINT "Oauth_pkey" PRIMARY KEY ("id");

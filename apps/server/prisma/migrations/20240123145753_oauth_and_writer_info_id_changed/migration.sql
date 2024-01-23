/*
  Warnings:

  - The primary key for the `Oauth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Oauth` table. All the data in the column will be lost.
  - The primary key for the `WriterInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `WriterInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Oauth" DROP CONSTRAINT "Oauth_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Oauth_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "WriterInfo" DROP CONSTRAINT "WriterInfo_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "WriterInfo_pkey" PRIMARY KEY ("userId");

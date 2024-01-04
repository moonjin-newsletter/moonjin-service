/*
  Warnings:

  - The primary key for the `Oauth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Oauth` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[oauthId]` on the table `Oauth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `WriterInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `oauthId` to the `Oauth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `WriterInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WriterInfo" DROP CONSTRAINT "WriterInfo_id_fkey";

-- AlterTable
ALTER TABLE "Oauth" DROP CONSTRAINT "Oauth_pkey",
ADD COLUMN     "oauthId" CHAR(64) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Oauth_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 0;

-- AlterTable
CREATE SEQUENCE writerinfo_id_seq;
ALTER TABLE "WriterInfo" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('writerinfo_id_seq');
ALTER SEQUENCE writerinfo_id_seq OWNED BY "WriterInfo"."id";

-- CreateIndex
CREATE UNIQUE INDEX "Oauth_oauthId_key" ON "Oauth"("oauthId");

-- CreateIndex
CREATE UNIQUE INDEX "WriterInfo_userId_key" ON "WriterInfo"("userId");

-- AddForeignKey
ALTER TABLE "WriterInfo" ADD CONSTRAINT "WriterInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

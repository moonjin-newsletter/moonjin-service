/*
  Warnings:

  - You are about to drop the column `moonjinEmail` on the `WriterInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[moonjinId]` on the table `WriterInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `moonjinId` to the `WriterInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Post_writerId_key";

-- DropIndex
DROP INDEX "Series_writerId_key";

-- DropIndex
DROP INDEX "WriterInfo_moonjinEmail_key";

-- AlterTable
ALTER TABLE "WriterInfo" DROP COLUMN "moonjinEmail",
ADD COLUMN     "moonjinId" VARCHAR(32) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WriterInfo_moonjinId_key" ON "WriterInfo"("moonjinId");

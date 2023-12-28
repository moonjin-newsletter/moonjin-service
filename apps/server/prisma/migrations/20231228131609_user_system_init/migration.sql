/*
  Warnings:

  - You are about to alter the column `moonjinEmail` on the `WriterInfo` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(32)`.

*/
-- AlterTable
ALTER TABLE "WriterInfo" ALTER COLUMN "moonjinEmail" SET DATA TYPE VARCHAR(32);

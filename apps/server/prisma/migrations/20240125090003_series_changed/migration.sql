/*
  Warnings:

  - Added the required column `title` to the `Series` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Series" ADD COLUMN     "releasedAt" TIMESTAMP(3),
ADD COLUMN     "title" VARCHAR(32) NOT NULL;

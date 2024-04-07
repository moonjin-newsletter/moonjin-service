/*
  Warnings:

  - Made the column `cover` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cover` on table `Series` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "cover" SET NOT NULL;

-- AlterTable
ALTER TABLE "Series" ALTER COLUMN "cover" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "image" DROP DEFAULT;

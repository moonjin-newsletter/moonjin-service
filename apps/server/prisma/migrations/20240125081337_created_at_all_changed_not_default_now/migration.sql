/*
  Warnings:

  - The primary key for the `Newsletter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Newsletter` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Series` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - Made the column `releasedAt` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Series` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Newsletter" DROP CONSTRAINT "Newsletter_pkey",
DROP COLUMN "id",
ALTER COLUMN "sentAt" DROP DEFAULT,
ADD CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("postId", "receiverId");

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "releasedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Series" DROP COLUMN "title",
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WriterInfo" ALTER COLUMN "createdAt" DROP DEFAULT;

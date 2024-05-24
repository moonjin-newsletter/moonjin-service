/*
  Warnings:

  - The primary key for the `Newsletter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `receiverId` on the `Newsletter` table. All the data in the column will be lost.
  - You are about to drop the `ExternalFollow` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `postContentId` to the `Newsletter` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Newsletter_receiverId_idx";

-- AlterTable
ALTER TABLE "Newsletter" DROP CONSTRAINT "Newsletter_pkey",
DROP COLUMN "receiverId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "postContentId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER,
ADD CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "ExternalFollow";

-- CreateTable
CREATE TABLE "SubscribeExternal" (
    "writerId" INTEGER NOT NULL,
    "followerEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscribeExternal_pkey" PRIMARY KEY ("followerEmail","writerId")
);

-- CreateTable
CREATE TABLE "NewsletterInMail" (
    "newsletterId" INTEGER NOT NULL,
    "receiverEmail" TEXT NOT NULL,
    "isSent" BOOLEAN NOT NULL DEFAULT false,
    "isOpened" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NewsletterInMail_pkey" PRIMARY KEY ("newsletterId","receiverEmail")
);

-- CreateTable
CREATE TABLE "NewsletterInWeb" (
    "newsletterId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "hideByReceiver" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NewsletterInWeb_pkey" PRIMARY KEY ("newsletterId","receiverId")
);

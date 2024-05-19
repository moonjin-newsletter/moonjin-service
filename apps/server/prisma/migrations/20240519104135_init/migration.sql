/*
  Warnings:

  - You are about to drop the `Follow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Follow";

-- CreateTable
CREATE TABLE "Subscribe" (
    "followerId" INTEGER NOT NULL,
    "writerId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "hide" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Subscribe_pkey" PRIMARY KEY ("followerId","writerId")
);

-- CreateIndex
CREATE INDEX "Subscribe_writerId_idx" ON "Subscribe"("writerId");

-- CreateIndex
CREATE INDEX "Subscribe_followerId_idx" ON "Subscribe"("followerId");

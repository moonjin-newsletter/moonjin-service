/*
  Warnings:

  - You are about to drop the `Writer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Writer";

-- CreateTable
CREATE TABLE "WriterInfo" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "moonjinId" VARCHAR(32) NOT NULL,
    "description" VARCHAR(256) NOT NULL DEFAULT '',
    "newsletterCount" INTEGER NOT NULL DEFAULT 0,
    "seriesCount" INTEGER NOT NULL DEFAULT 0,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WriterInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WriterInfo_userId_key" ON "WriterInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WriterInfo_moonjinId_key" ON "WriterInfo"("moonjinId");

-- CreateTable
CREATE TABLE "Letter" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "title" VARCHAR(64) NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Letter_senderId_idx" ON "Letter"("senderId");

-- CreateIndex
CREATE INDEX "Letter_receiverId_idx" ON "Letter"("receiverId");

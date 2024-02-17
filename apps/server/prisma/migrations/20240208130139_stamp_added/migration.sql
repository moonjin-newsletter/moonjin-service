-- CreateTable
CREATE TABLE "Stamp" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stamp_pkey" PRIMARY KEY ("userId","postId")
);

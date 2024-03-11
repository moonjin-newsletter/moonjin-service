-- CreateTable
CREATE TABLE "ExternalFollow" (
    "writerId" INTEGER NOT NULL,
    "followerEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalFollow_pkey" PRIMARY KEY ("followerEmail","writerId")
);

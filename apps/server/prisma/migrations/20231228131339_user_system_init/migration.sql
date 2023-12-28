-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "nickname" SET DATA TYPE VARCHAR(16);

-- CreateTable
CREATE TABLE "WriterInfo" (
    "id" INTEGER NOT NULL,
    "moonjinEmail" TEXT NOT NULL,

    CONSTRAINT "WriterInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WriterInfo_moonjinEmail_key" ON "WriterInfo"("moonjinEmail");

-- AddForeignKey
ALTER TABLE "WriterInfo" ADD CONSTRAINT "WriterInfo_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

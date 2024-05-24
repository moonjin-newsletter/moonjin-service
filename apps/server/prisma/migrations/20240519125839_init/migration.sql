-- AlterTable
ALTER TABLE "Letter" ALTER COLUMN "title" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" VARCHAR(256) NOT NULL DEFAULT '문진 독자 계정입니다.';

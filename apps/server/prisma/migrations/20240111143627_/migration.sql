/*
  Warnings:

  - Added the required column `social` to the `Oauth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Oauth" ADD COLUMN     "social" CHAR(8) NOT NULL;

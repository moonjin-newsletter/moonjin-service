/*
  Warnings:

  - The primary key for the `Oauth` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Oauth" DROP CONSTRAINT "Oauth_pkey",
ADD CONSTRAINT "Oauth_pkey" PRIMARY KEY ("oauthId");

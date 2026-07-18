/*
  Warnings:

  - You are about to drop the column `externalId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_externalId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "externalId",
ADD COLUMN     "authId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WalletAsset" ADD COLUMN     "usdValue" DECIMAL(18,2),
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(38,18);

-- CreateIndex
CREATE UNIQUE INDEX "User_authId_key" ON "User"("authId");

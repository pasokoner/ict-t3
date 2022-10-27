/*
  Warnings:

  - You are about to drop the column `userId` on the `Equipment` table. All the data in the column will be lost.
  - Added the required column `userId` to the `EquipmentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Equipment" DROP CONSTRAINT "Equipment_userId_fkey";

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "EquipmentHistory" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EquipmentHistory" ADD CONSTRAINT "EquipmentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

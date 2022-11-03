-- CreateEnum
CREATE TYPE "Groups" AS ENUM ('GSO', 'PITO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "group" "Groups";

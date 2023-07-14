/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Discussion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_teacherId_fkey";

-- AlterTable
ALTER TABLE "Discussion" DROP COLUMN "teacherId";

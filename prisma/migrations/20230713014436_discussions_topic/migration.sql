/*
  Warnings:

  - Added the required column `topicId` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "topicId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

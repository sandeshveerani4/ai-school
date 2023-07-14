/*
  Warnings:

  - A unique constraint covering the columns `[studentId,topicId]` on the table `Discussion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Discussion_studentId_topicId_key" ON "Discussion"("studentId", "topicId");

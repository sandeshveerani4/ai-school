-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "chosenOptions" JSONB[],
ADD COLUMN     "correct" INTEGER;

-- CreateIndex
CREATE INDEX "Submission_studentId_idx" ON "Submission"("studentId");

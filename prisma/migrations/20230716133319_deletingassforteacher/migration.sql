-- DropForeignKey
ALTER TABLE "QuestionForAssignment" DROP CONSTRAINT "QuestionForAssignment_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionForAssignment" DROP CONSTRAINT "QuestionForAssignment_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Remarks" DROP CONSTRAINT "Remarks_submissionId_fkey";

-- DropForeignKey
ALTER TABLE "Remarks" DROP CONSTRAINT "Remarks_userId_fkey";

-- AddForeignKey
ALTER TABLE "Remarks" ADD CONSTRAINT "Remarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remarks" ADD CONSTRAINT "Remarks_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionForAssignment" ADD CONSTRAINT "QuestionForAssignment_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionForAssignment" ADD CONSTRAINT "QuestionForAssignment_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

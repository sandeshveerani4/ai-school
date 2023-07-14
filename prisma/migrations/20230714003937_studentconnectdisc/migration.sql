-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_studentId_fkey";

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

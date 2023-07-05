-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'FILL');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "fill" TEXT,
ADD COLUMN     "type" "QuestionType" NOT NULL DEFAULT 'MCQ';

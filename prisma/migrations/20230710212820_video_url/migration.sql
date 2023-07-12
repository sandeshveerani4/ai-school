-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "video_url" TEXT;

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "score" SET DEFAULT 1;

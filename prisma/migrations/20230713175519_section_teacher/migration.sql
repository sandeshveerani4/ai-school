/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Class` table. All the data in the column will be lost.
  - Added the required column `teacherId` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_teacherId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "teacherId";

-- AlterTable
ALTER TABLE "Section" ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Remarks" (
    "id" SERIAL NOT NULL,
    "remarks" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "submissionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Remarks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remarks" ADD CONSTRAINT "Remarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remarks" ADD CONSTRAINT "Remarks_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

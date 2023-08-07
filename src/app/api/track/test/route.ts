import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const aggregate: { id: number; title: string; result: number } =
    await prisma.$queryRaw`SELECT "Assignment".ID,
    "Assignment"."title",
    (DIV(SUM("Submission"."correct"),
                (SELECT COUNT("QuestionForAssignment"."questionId")
                  FROM PUBLIC."QuestionForAssignment"
                  WHERE "QuestionForAssignment"."assignmentId" = "Assignment".ID
                  GROUP BY "QuestionForAssignment"."assignmentId")) * 100)::float AS RESULT,
    "Subject"."classId",
    "Subject"."sectionId",
    COUNT("Submission"."id")::integer as attempts
  FROM PUBLIC."Submission"
  RIGHT JOIN PUBLIC."Assignment" ON "Assignment".ID = "Submission"."assignmentId"
  LEFT JOIN PUBLIC."Topic" ON "Assignment"."topicId" = "Topic"."id"
  LEFT JOIN PUBLIC."Subject" ON "Subject"."id" = "Topic"."subjectId"
  WHERE "Assignment"."type" = 'QUIZ'
  GROUP BY "Submission"."assignmentId",
    "Assignment".ID,
    "Subject"."classId",
    "Subject"."sectionId";`;
  return NextResponse.json(aggregate);
}

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const aggregate: { id: number; title: string; result: number } =
    await prisma.$queryRaw`SELECT "userId",
	FIRST_NAME,
	LAST_NAME,
	"Class"."name" AS "class",
	"Section"."name" AS "section", XP,
	(SELECT AVG(RESULT)
		FROM
			(SELECT (DIV(SUM("Submission"."correct"),
																	(SELECT COUNT("QuestionForAssignment"."questionId")
																		FROM PUBLIC."QuestionForAssignment"
																		WHERE "QuestionForAssignment"."assignmentId" = "Assignment".ID
																		GROUP BY "QuestionForAssignment"."assignmentId")) * 100)::float AS RESULT
				FROM PUBLIC."Submission"
				RIGHT JOIN PUBLIC."Assignment" ON "Assignment".ID = "Submission"."assignmentId"
				WHERE "Submission"."studentId" = "Student"."userId"
				GROUP BY "Submission"."assignmentId",
					"Assignment".ID) AS A),COUNT("Submission"."id")::integer AS "count"
FROM PUBLIC."Student"
JOIN PUBLIC."User" ON "Student"."userId" = "User"."id"
JOIN PUBLIC."Class" ON "Student"."classId" = "Class"."id"
JOIN PUBLIC."Section" ON "Student"."sectionId" = "Section"."id"
LEFT JOIN PUBLIC."Submission" ON "Student"."userId"="Submission"."studentId" GROUP BY "Student"."userId",FIRST_NAME,
	LAST_NAME,"Class"."name","Section"."name";`;
  return NextResponse.json(aggregate);
}

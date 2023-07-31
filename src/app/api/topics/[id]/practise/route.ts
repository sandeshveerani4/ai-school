import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";
import { Question } from "@/components/Questions/GetQuestions";
import { Option } from "@prisma/client";
const checkOptions = async (topicId: number, payload: any) => {
  var score = 0,
    count = 0;
  var xp = 0;
  var extraXp = 0;
  const questions: {
    [key: string]: any;
  } = await prisma.question.findMany({
    where: {
      topicId: topicId,
    },
    include: { options: { where: { correct: true } } },
  });
  questions.map((question: any) => {
    const search = payload[String(question.id)];
    if (search) {
      if (question.type === "MCQ" && question.options[0].id === search) {
        question.right = true;
        score += question.score;
        count++;
        xp += 10;
        extraXp += 10;
      } else if (question.type === "FILL" && question.fill === search) {
        question.right = true;
        score++;
        count++;
        xp += 10;
        extraXp += 10;
      } else {
        extraXp = 0;
      }
    }
  });
  xp += extraXp;
  return { score, count, xp, questions };
};
export const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const body = await req.json();
  const checking = await checkOptions(Number(params.id), body);
  if (checking.xp > 0) {
    await prisma.student.update({
      where: {
        userId: auth.id,
      },
      data: {
        xp: {
          increment: checking.xp,
        },
      },
    });
  }
  return NextResponse.json(checking);
};
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const questions = await prisma.$queryRaw<
    Question[]
  >`SELECT * FROM "public"."Question" WHERE "topicId"= ${Number(
    params.id
  )} ORDER BY random() LIMIT 10`;
  await Promise.all(
    questions.map(async (question, index) => {
      questions[index].options = await prisma.$queryRaw<
        Option[]
      >`SELECT "id","option","image","questionId" FROM "public"."Option" WHERE "questionId"= ${question.id} ORDER BY random() LIMIT 10`;
    })
  );
  return NextResponse.json(questions);
}

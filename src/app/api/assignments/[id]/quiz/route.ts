import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return unAuthorized;
  if (auth.role !== "STUDENT") return unAuthorized;
  const quizzes = await prisma.assignment.findFirst({
    where: {
      id: Number(params.id),
      topic: {
        subject: {
          classId: auth.student?.classId,
          sectionId: auth.student?.sectionId,
        },
      },
      visible: true,
      enabled: true,
      type: "QUIZ",
    },
    include: {
      questions: {
        include: {
          question: {
            include: {
              options: { select: { id: true, option: true, image: true } },
            },
          },
        },
      },
      submissions: {
        where: {
          studentId: auth.id,
        },
      },
    },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(quizzes);
}
const checkOptions = async (assignId: number, payload: any) => {
  var score = 0,
    count = 0;
  const getQuestionsWithAnswers = await prisma.assignment.findFirst({
    where: {
      id: assignId,
    },
    include: {
      questions: {
        include: {
          question: { include: { options: { where: { correct: true } } } },
        },
      },
    },
  });
  getQuestionsWithAnswers?.questions.map((val) => {
    const question = val.question;
    const search = payload[String(question.id)];
    console.log(question.options);
    if (search) {
      if (question.type === "MCQ" && question.options[0].id === search) {
        score += question.score;
        count++;
      }
      if (question.type === "FILL" && question.fill === search) {
        score++;
        count++;
      }
    }
  });
  return { score, count };
};
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "STUDENT") return unAuthorized;
  const body = await req.json();
  const checking = await checkOptions(Number(params.id), body);
  try {
    const previous = await prisma.submission.count({
      where: {
        assignmentId: Number(params.id),
        studentId: auth.id,
      },
    });
    if (previous)
      return NextResponse.json(
        { error: "You have already attempted this quiz!" },
        { status: 400 }
      );
    await prisma.submission.create({
      data: {
        chosenOptions: body,
        assignment: {
          connect: {
            id: Number(params.id),
          },
        },
        student: {
          connect: {
            userId: auth.id,
          },
        },
        score: checking.score,
        correct: checking.count,
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Some error Occured!" }, { status: 400 });
  }
}

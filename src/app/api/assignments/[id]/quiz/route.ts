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
  var xp = 0;
  var extraXp = 0;
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
  if (getQuestionsWithAnswers) {
    const questions: {
      [key: string]: any;
    } = getQuestionsWithAnswers.questions;
    questions.map((val: any) => {
      const question = val.question;
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
  } else {
    throw "Questions not found!";
  }
};
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "STUDENT") return unAuthorized;
  const body = await req.json();
  const currentTime = new Date();
  try {
    const assignment = await prisma.assignment.findFirst({
      where: { id: Number(params.id) },
      include: { submissions: { where: { studentId: auth.id } } },
    });
    if (assignment?.submissions.length)
      return NextResponse.json(
        { error: "You have already attempted this quiz!" },
        { status: 400 }
      );
    if (new Date(assignment?.deadline as Date) >= currentTime)
      return NextResponse.json({ error: "Timeout!" }, { status: 400 });
    const checking = await checkOptions(Number(params.id), body);

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
        ...(checking.xp > 0 && { xpInc: checking.xp }),
      },
    });
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
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Some error Occured!" }, { status: 400 });
  }
}

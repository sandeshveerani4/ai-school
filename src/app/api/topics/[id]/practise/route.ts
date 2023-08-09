import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";
import { Question } from "@/components/Questions/GetQuestions";
import { Option } from "@prisma/client";
import { ChatCompletionRequestMessage } from "openai";
import { openAI } from "@/lib/srv-funcs";
const checkOptions = async (
  topicId: number,
  payload: any,
  questions: {
    [key: string]: any;
  }
) => {
  var score = 0,
    count = 0;
  var xp = 0;
  var extraXp = 0;
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
  const checking = await checkOptions(
    Number(params.id),
    body.chosen,
    body.questions
  );
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
  /* const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth; */
  const topicId = Number(params.id);
  const aiMode = req.nextUrl.searchParams.get("ai");
  const qids: number[] = [];
  if (aiMode && aiMode === "true") {
    const topic = await prisma.topic.findFirst({
      where: { id: topicId },
      include: { subject: { include: { class: true, section: true } } },
    });
    const msgArr: ChatCompletionRequestMessage[] = [
      {
        content: `Generate 2 MCQs for Subject "${topic?.subject.name}" and the topic is "${topic?.title}" for "${topic?.subject.class.name}" Class Standard and your answer should be an array in JSON format and only one option should be correct: [{"question":QuestionHere,options:[{option:OptionHere,correct:true/false},...otherOptions]},otherQuestions]`,
        role: "user",
      },
    ];
    try {
      const aiResp = await openAI(msgArr);
      const resp: {
        question: string;
        options: { option: string; correct: boolean }[];
      }[] = JSON.parse(aiResp as string);
      await Promise.all(
        resp.map(async (item) => {
          const q = await prisma.question.create({
            select: { id: true },
            data: {
              score: 1,
              question: item.question,
              topic: {
                connect: {
                  id: topicId,
                },
              },
              is_AI: true,
              type: "MCQ",
              options: { createMany: { data: item.options } },
            },
          });
          qids.push(q.id);
        })
      );
    } catch (e) {
      console.error("Error", e);
    }
  }
  const questions = await prisma.$queryRawUnsafe<Question[]>(
    `SELECT * FROM "public"."Question" WHERE "topicId"= ${topicId} ${
      aiMode && aiMode === "true" && qids.length > 0
        ? `AND id IN (${qids.join(",")})`
        : "ORDER BY random() LIMIT 10"
    }`
  );
  await Promise.all(
    questions.map(async (question, index) => {
      questions[index].options = await prisma.$queryRaw<
        Option[]
      >`SELECT "id","option","image","questionId" FROM "public"."Option" WHERE "questionId"= ${question.id} ORDER BY random() LIMIT 10`;
    })
  );
  return NextResponse.json(questions);
}

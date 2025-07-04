import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role === "STUDENT") return unAuthorized;
  const searchParams = req.nextUrl.searchParams;
  const topicId = searchParams.get("topicId");
  const questions = await prisma.question.findMany({
    ...(topicId && { where: { topicId: Number(topicId) } }),
    include: { options: true, topic: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(questions);
}
export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role === "STUDENT") return unAuthorized;
  const body = await req.json();
  try {
    await prisma.question.create({
      data: {
        score: Number(body.score),
        question: body.question,
        image: body.image,
        topic: {
          connect: {
            id: Number(body.topicId),
          },
        },
        type: body.type,
        fill: body.fill,
        ...(body.type === "MCQ" && {
          options: { createMany: { data: body.options } },
        }),
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
  }
}

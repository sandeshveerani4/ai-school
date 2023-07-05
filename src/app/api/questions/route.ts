import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const questions = await prisma.question.findMany({
    include: { options: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(questions);
}
export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const body = await req.json();
  try {
    await prisma.question.create({
      data: {
        score: Number(body.score),
        question: body.question,
        image: body.image,
        options: { createMany: { data: body.options } },
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        return NextResponse.json(
          { error: "Username already exists!" },
          { status: 400 }
        );
      }
    }
  }
}

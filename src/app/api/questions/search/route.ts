import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role === "STUDENT") return unAuthorized;
  const body = await req.json();
  const result = await prisma.question.findMany({
    where: {
      question: {
        contains: body.query,
        mode: "insensitive",
      },
      topicId: Number(body.topicId),
    },
  });
  return NextResponse.json(result);
}

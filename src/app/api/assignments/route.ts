import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth !== "ADMIN") return unAuthorized;
  const students = await prisma.assignment.findMany({
    include: {
      _count: {
        select: { submissions: true },
      },
      topic: {
        include: {
          subject: {
            include: {
              class: true,
              section: true,
              teacher: { include: { user: true } },
            },
          },
        },
      },
    },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(students);
}
export async function POST(req: NextRequest) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth === "STUDENT") return unAuthorized;
  const body = await req.json();
  try {
    const result = await prisma.assignment.create({
      data: {
        title: body.title,
        deadline: new Date(body.deadline),
        description: body.description,
        topic: {
          connect: {
            id: Number(body.topicId),
          },
        },
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Some error Occured!" }, { status: 400 });
  }
}

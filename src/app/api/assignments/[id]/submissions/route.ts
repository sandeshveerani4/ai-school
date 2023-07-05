import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return unAuthorized;
  const students = await prisma.submission.findMany({
    where: {
      assignmentId: Number(params.id),
    },
    include: {
      assignment: true,
      student: {
        include: {
          user: true,
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

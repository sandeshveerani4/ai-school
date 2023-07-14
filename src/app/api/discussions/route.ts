import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const discussions = await prisma.discussion.findMany({
    ...(auth.role === "STUDENT" && {
      where: { topic: { subject: { classId: auth.student?.classId } } },
    }),
    include: {
      topic: {
        include: {
          subject: {
            include: {
              section: {
                include: { classTeacher: { include: { user: true } } },
              },
            },
          },
        },
      },
      student: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(discussions);
}
export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const body = await req.json();
  console.log(body);
  try {
    await prisma.discussion.create({
      data: {
        student: {
          connect: {
            userId: auth.id,
          },
        },
        topic: {
          connect: {
            id: body.topicId,
          },
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
  }
}

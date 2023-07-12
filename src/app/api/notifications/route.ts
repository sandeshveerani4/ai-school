import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const students = await prisma.notificationMessage.findMany({
    include: { _count: { select: { notifications: true } }, author: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(students);
}
export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role === "STUDENT") return unAuthorized;
  const body = await req.json();
  try {
    const target: { userId: number }[] = [];
    if (body.students) {
      (
        await prisma.student.findMany({
          ...(body.classId &&
            Number(body.classId) !== 0 &&
            body.sectionId && {
              where: {
                classId: Number(body.classId),
                sectionId: Number(body.sectionId),
              },
            }),
          select: {
            userId: true,
          },
        })
      ).forEach((val) => {
        target.push({ userId: val.userId });
      });
    }
    if (body.teachers) {
      (
        await prisma.teacher.findMany({
          select: {
            userId: true,
          },
        })
      ).forEach((val) => {
        target.push({ userId: val.userId });
      });
    }
    await prisma.notificationMessage.create({
      data: {
        author: {
          connect: {
            id: auth.id,
          },
        },
        content: body.content,
        link: body.link,
        title: body.title,
        notifications: {
          createMany: {
            data: target,
          },
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
  }
}

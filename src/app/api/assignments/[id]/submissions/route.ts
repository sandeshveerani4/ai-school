import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
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
      ...(auth.role === "STUDENT" && {
        student: {
          userId: auth.id,
        },
      }),
    },
    ...(auth.role !== "STUDENT" && {
      include: {
        assignment: true,
        student: {
          include: {
            user: true,
          },
        },
      },
    }),
    orderBy: { id: "desc" },
  });
  return NextResponse.json(students);
}
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const body = await req.json();
  try {
    const result = await prisma.submission.create({
      data: {
        description: body.description,
        student: {
          connect: {
            userId: auth.id,
          },
        },
        assignment: {
          connect: {
            id: Number(params.id),
          },
        },
        ...(body.files.length !== 0 && {
          files: body.files.map((file: any) => {
            if (file && file?.file) return file;
          }),
        }),
        xpInc: 10,
      },
    });
    await prisma.student.update({
      where: { userId: auth.id },
      data: { xp: { increment: 10 } },
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Some error Occured!" }, { status: 400 });
  }
}

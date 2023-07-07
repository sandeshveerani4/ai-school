import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return unAuthorized;
  if (auth.role !== "STUDENT") return unAuthorized;
  const quizzes = await prisma.assignment.findFirst({
    where: {
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
    },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(quizzes);
}
export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role === "STUDENT") return unAuthorized;
  const body = await req.json();
  try {
    const result = await prisma.assignment.create({
      data: {
        title: body.title,
        deadline: new Date(body.deadline),
        description: body.description,
        visible: Boolean(body.visible),
        enabled: Boolean(body.enabled),
        type: body.type,
        ...(typeof body.willStartAt !== "string" && {
          willStartAt: new Date(body.willStartAt),
        }),
        topic: {
          connect: {
            id: Number(body.topicId),
          },
        },
        ...(body.questions.length !== 0 && {
          questions: {
            create: body.questions.map((id: number) => {
              return { question: { connect: { id: id } } };
            }),
          },
        }),
        ...(body.files.length !== 0 && {
          files: body.files.map((file: any) => {
            if (file && file?.file) return file;
          }),
        }),
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Some error Occured!" }, { status: 400 });
  }
}

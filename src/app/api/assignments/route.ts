import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return unAuthorized;
  const count=req.nextUrl.searchParams.get('count');
  const students = await prisma.assignment.findMany({
    ...(auth.role === "STUDENT" && {
      where: {
        topic: {
          subject: {
            classId: auth.student?.classId,
            sectionId: auth.student?.sectionId,
          },
        },
        visible: true,
      },
    }),
    ...(auth.role === "TEACHER" && {
      where: {
        userID:auth.id
      },
    }),
    include: {
      _count: {
        select: {
          submissions:
            auth.role === "STUDENT" ? { where: { studentId: auth.id } } : true,
        },
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
      ...(auth.role === "STUDENT" && {
        submissions: {
          where: { studentId: auth.id },
        },
      }),
      user:true
    },
    orderBy: { id: "desc" },
    ...count && {take:Number(count)}
  });
  return NextResponse.json(students);
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
        user:{connect:{
          id:auth.id
        }},
        type: body.type,
        ...(body.type === "VIDEO_LESSON" && { video_url: body.video_url }),
        ...(body.willStartAt && {
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

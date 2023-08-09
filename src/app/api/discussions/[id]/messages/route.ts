import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";
import { ChatCompletionRequestMessage } from "openai";
import { openAI } from "@/lib/srv-funcs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const discussions = await prisma.messages.findMany({
    where: {
      discussionId: Number(params.id),
    },
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });
  return NextResponse.json(discussions);
}
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const body = await req.json();
  const createMessage = async (content: string, is_AI = false) => {
    await prisma.messages.create({
      data: {
        is_student: auth.role === "STUDENT",
        discussion: {
          connect: {
            id: Number(params.id),
          },
        },
        content: content,
        is_AI: is_AI,
        ...(!is_AI && {
          user: {
            connect: {
              id: auth.id,
            },
          },
        }),
      },
    });
  };
  await createMessage(body.content);
  try {
    if (body.is_AI) {
      const discussion = await prisma.discussion.findFirst({
        where: { id: Number(params.id) },
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
      const msgArr: ChatCompletionRequestMessage[] = [
        {
          content: `You are a teacher and have to discuss queries "${discussion?.topic.title}" of Subject "${discussion?.topic.subject.name} to ${discussion?.student.user.first_name}. Here are the queries:"`,
          role: "system",
        },
        { content: body.content, role: "user" },
      ];
      const aiResp = await openAI(msgArr);
      aiResp && (await createMessage(aiResp as string, true));
    }
  } catch {}
  return NextResponse.json({ success: true });
}

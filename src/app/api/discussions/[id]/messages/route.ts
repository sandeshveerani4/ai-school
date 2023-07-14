import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";
import { openAI } from "@/lib/srv-funcs";
import { ChatCompletionRequestMessage } from "openai";

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
  console.log(body);
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
  try {
    await createMessage(body.content);
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
      console.log(aiResp);
      aiResp && (await createMessage(aiResp as string, true));
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
  }
}

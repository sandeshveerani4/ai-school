import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

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
  await createMessage(body.content);
  return NextResponse.json({ success: true });
}

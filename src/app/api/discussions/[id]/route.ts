import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
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
  return NextResponse.json(discussion);
}

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const body = await req.json();
  const result = await prisma.topic.findMany({
    where: {
      OR: [
        {
          title: {
            contains: body.query,
            mode: "insensitive",
          },
        },
        {
          subject: {
            name: {
              contains: body.query,
              mode: "insensitive",
            },
          },
        },
      ],
      ...(auth.role === "STUDENT" && {
        subject: { classId: auth.student?.classId },
      }),
    },
    include: { subject: { include: { class: true, section: true } } },
  });
  return NextResponse.json(result);
}

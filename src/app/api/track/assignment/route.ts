import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const aggregate = await prisma.assignment.findMany({
    include: {
      _count: { select: { submissions: true } },
      topic: {
        include: { subject: { include: { class: true, section: true } } },
      },
    },
    where: { type: "HOMEWORK" },
  });
  return NextResponse.json(aggregate);
}

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const count = req.nextUrl.searchParams.get("count");
  const students = await prisma.student.findMany({
    ...(count && { take: Number(count) }),
    orderBy: { xp: "desc" },
    include: { user: true },
  });
  return NextResponse.json(students);
}

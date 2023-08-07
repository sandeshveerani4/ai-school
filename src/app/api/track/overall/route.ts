import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const aggregate = (
    await prisma.student.groupBy({
      by: ["classId"],
      _sum: { xp: true },
    })
  ).map((item, index) => {
    return { ...item, id: index };
  });
  return NextResponse.json(aggregate);
}

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const body = await req.json();
  const start = new Date(body.date);
  start.setHours(0, 0);
  const end = new Date(body.date);
  end.setHours(23, 59);
  const assignments = await prisma.assignment.findMany({
    where: { deadline: { gte: start, lte: end } },
    include: { user: true, submissions: true },
  });
  return NextResponse.json(assignments);
}

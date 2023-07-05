import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const classes = await prisma.class.findMany({
    orderBy: { rank: "desc" },
    include: { classTeacher: { include: { user: true } }, sections: true },
  });
  return NextResponse.json(classes);
}
export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const body = await req.json();
  const sclass = await prisma.class.create({
    data: {
      name: body.name,
      rank: Number(body.rank),
      teacherId: Number(body.teacher),
    },
    include: { classTeacher: true },
  });
  return NextResponse.json(sclass);
}

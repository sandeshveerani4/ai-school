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
      classTeacher: {
        connectOrCreate: {
          where: { userId: Number(body.teacher) },
          create: { userId: Number(body.teacher) },
        },
      },
    },
  });
  return NextResponse.json(sclass);
}

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  const classes = await prisma.class.findMany({
    orderBy: { rank: "desc" },
    include: { classTeacher: { include: { user: true } }, sections: true },
  });
  return NextResponse.json(classes);
}
export async function POST(req: NextRequest) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth !== "ADMIN") return unAuthorized;
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

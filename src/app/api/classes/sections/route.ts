import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authorize, unAuthorized } from "@/lib/authorize";
interface RequestBody {
  name: string;
  classId: number;
}
export async function GET(req: NextRequest, res: NextResponse) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  const body = await req.json();
  const classes = await prisma.section.findMany({
    where: { classId: body.classId },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(classes);
}
export async function POST(req: NextRequest, res: NextResponse) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth !== "ADMIN") return unAuthorized;
  const body: RequestBody = await req.json();
  const sclass = await prisma.section.create({
    data: {
      name: body.name,
      classId: body.classId,
    },
  });
  return NextResponse.json(sclass);
}

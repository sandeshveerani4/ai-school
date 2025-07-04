import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const result = await prisma.topic.findMany({
    where: {
      subject: { sectionId: Number(params.id) },
    },
    include: { subject: { include: { class: true, section: true } } },
  });
  return NextResponse.json(result);
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  await prisma.topic.deleteMany({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ success: true });
}
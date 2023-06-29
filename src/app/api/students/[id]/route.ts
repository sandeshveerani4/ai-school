import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { authorize, unAuthorized } from "@/lib/authorize";
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth !== "ADMIN") return unAuthorized;
  const students = await prisma.user.delete({
    where: { id: Number(params.id) },
    include: { profile: true, student: { include: { class: true } } },
  });
  return NextResponse.json(students);
}
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth === "TEACHER") return unAuthorized;
  const students = await prisma.user.findFirst({
    where: { role: "STUDENT", id: Number(params.id) },
    include: { profile: true, student: { include: { class: true } } },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(students);
}

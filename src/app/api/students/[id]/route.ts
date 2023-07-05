import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { User, authorize, unAuthorized } from "@/lib/authorize";
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const students = await prisma.user.delete({
    where: { id: Number(params.id) },
    include: { student: { include: { class: true } } },
  });
  return NextResponse.json(students);
}
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const students = await prisma.user.findFirst({
    where: { role: "STUDENT", id: Number(params.id) },
    include: { student: { include: { class: true } } },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(students);
}

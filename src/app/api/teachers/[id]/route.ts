import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authorize, unAuthorized } from "@/lib/authorize";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth !== "STUDENT") return unAuthorized;
  const teachers = await prisma.user.findFirst({
    where: { role: "TEACHER", id: Number(params.id) },
    include: { profile: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(teachers);
}

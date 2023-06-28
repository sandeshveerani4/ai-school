import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const accessToken = req.headers.get("authorization");
  if (!accessToken || !verifyJwt(accessToken)) {
    return new Response(
      JSON.stringify({
        error: "unauthorized",
      }),
      {
        status: 401,
      }
    );
  }
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
  const accessToken = req.headers.get("authorization");
  if (!accessToken || !verifyJwt(accessToken)) {
    return new Response(
      JSON.stringify({
        error: "unauthorized",
      }),
      {
        status: 401,
      }
    );
  }
  const students = await prisma.user.findFirst({
    where: { role: "STUDENT", id: Number(params.id) },
    include: { profile: true, student: { include: { class: true } } },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(students);
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";

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
  const teachers = await prisma.user.findFirst({
    where: { role: "TEACHER", id: Number(params.id) },
    include: { profile: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(teachers);
}

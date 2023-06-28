import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { NextApiRequest } from "next";

export async function GET(req: NextApiRequest, res: NextResponse) {
  const accessToken = req.headers["authorization"];
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
  const { id } = req.query;
  const students = await prisma.user.findFirst({
    where: { role: "STUDENT", id: Number(id) },
    include: { profile: true, student: { include: { class: true } } },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(students);
}

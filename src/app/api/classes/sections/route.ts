import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
interface RequestBody {
  name: string;
  classId: number;
}
export async function GET(req: NextRequest, res: NextResponse) {
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
  const body = await req.json();
  const classes = await prisma.section.findMany({
    where: { classId: body.classId },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(classes);
}
export async function POST(req: NextRequest, res: NextResponse) {
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
  const body: RequestBody = await req.json();
  const sclass = await prisma.section.create({
    data: {
      name: body.name,
      classId: body.classId,
    },
  });
  return NextResponse.json(sclass);
}

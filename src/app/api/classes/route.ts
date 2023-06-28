import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
interface RequestBody {
  name: string;
  rank: number;
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
  const classes = await prisma.class.findMany({ orderBy: { rank: "desc" } });
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
  const sclass = await prisma.class.create({
    data: {
      name: body.name,
      rank: body.rank,
    },
  });
  return NextResponse.json(sclass);
}

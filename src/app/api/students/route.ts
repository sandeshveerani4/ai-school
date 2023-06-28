import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
interface RequestBody {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  class: number;
  section?: number;
  date_of_birth?: object;
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
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {  profile: true, student: { include: { class: true } } },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(students);
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
  const result = await prisma.user.create({
    data: {
      username: body.username,
      password: await bcrypt.hash(body.password, 10),
      role: "STUDENT",
      profile: {
        create: {
          first_name: body.first_name,
          last_name: body.last_name,
        },
      },
      student: {
        create: {
          class: {
            connect: {
              id: Number(body.class),
            },
          },
        },
      },
    },
  });
  const { password, ...data } = result;
  return NextResponse.json({ ...data });
}

import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { User, authorize, unAuthorized } from "@/lib/authorize";
import { Prisma } from "@prisma/client";
interface RequestBody {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
}
export async function GET(req: NextRequest, res: NextResponse) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
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
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    include: { teacher: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(teachers);
}
export async function POST(req: NextRequest, res: NextResponse) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const body: RequestBody = await req.json();
  console.log(body);
  try {
    const result = await prisma.user.create({
      data: {
        username: body.username,
        password: await bcrypt.hash(body.password, 10),
        role: "TEACHER",
        first_name: body.first_name,
        last_name: body.last_name,
        ...(body.date_of_birth &&
          typeof body.date_of_birth !== "string" && {
            date_of_birth: new Date(body.date_of_birth),
          }),
      },
    });
    const { password, ...data } = result;
    return NextResponse.json({ ...data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        return NextResponse.json(
          { error: "Username already exists!" },
          { status: 400 }
        );
      }
    }
    console.log(e);
  }
}

import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { authorize, unAuthorized } from "@/lib/authorize";
interface RequestBody {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  class: number;
  section?: number;
  date_of_birth?: object;
  many?: boolean;
  data?: any;
}
export async function GET(req: NextRequest) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth !== "ADMIN") return unAuthorized;
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { student: { include: { class: true } } },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(students);
}
export async function POST(req: NextRequest) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth !== "ADMIN") return unAuthorized;
  const body: RequestBody = await req.json();
  try {
    if (body.many) {
      return NextResponse.json({ success: true });
    } else {
      const result = await prisma.user.create({
        data: {
          username: body.username,
          password: await bcrypt.hash(body.password, 10),
          role: "STUDENT",
          first_name: body.first_name,
          last_name: body.last_name,
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

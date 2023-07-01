import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { authorize, unAuthorized } from "@/lib/authorize";
interface RequestBody {
  name: string;
  class: number;
  section: number;
  teacher: number;
}
export async function GET(req: NextRequest) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth !== "ADMIN") return unAuthorized;
  const students = await prisma.subject.findMany({
    include: {
      class: true,
      section: true,
      teacher: { include: { user: true } },
    },
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
    const result = await prisma.subject.create({
      data: {
        name: body.name,
        class: {
          connect: {
            id: Number(body.class),
          },
        },
        section: {
          connect: {
            id: Number(body.section),
          },
        },
        teacher: {
          connect: {
            userId: Number(body.teacher),
          },
        },
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Some error Occured!" }, { status: 400 });
  }
}

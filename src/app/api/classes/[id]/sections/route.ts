import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";
interface RequestBody {
  name: string;
  classId: number;
  teacherId: number;
}
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const classes = await prisma.section.findMany({
    where: { classId: Number(params.id) },
    orderBy: { name: "asc" },
    include: { classTeacher: { include: { user: true } } },
  });
  return NextResponse.json(classes);
}
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const body: RequestBody = await req.json();
  const sclass = await prisma.section.create({
    data: {
      name: body.name,
      class: {
        connect: {
          id: Number(params.id),
        },
      },
      classTeacher: {
        connectOrCreate: {
          where: { userId: Number(body.teacherId) },
          create: { userId: Number(body.teacherId) },
        },
      },
    },
  });
  return NextResponse.json(sclass);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const body = await req.json();
  const sclass = await prisma.section.update({
    where: {
      id: Number(params.id),
    },
    data: {
      classTeacher: {
        connectOrCreate: {
          where: { userId: Number(body.teacherId) },
          create: { userId: Number(body.teacherId) },
        },
      },
    },
  });
  return NextResponse.json(sclass);
}

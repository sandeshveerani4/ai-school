import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";
interface RequestBody {
  name: string;
  classId: number;
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
  console.log(body);
  const sclass = await prisma.section.create({
    data: {
      name: body.name,
      class: {
        connect: {
          id: Number(params.id),
        },
      },
    },
  });
  return NextResponse.json(sclass);
}

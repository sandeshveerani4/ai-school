import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth === "STUDENT") return unAuthorized;
  const teachers = await prisma.topic.findMany({
    where: { subjectId: Number(params.id) },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(teachers);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role === "STUDENT") return unAuthorized;
  const body = await req.json();
  const topics = await prisma.topic.create({
    data: {
      title: body.title,
      description: body.description,
      subject: {
        connect: {
          id: Number(params.id),
        },
      },
    },
  });
  return NextResponse.json(topics);
}

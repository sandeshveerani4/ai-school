import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { authorize, unAuthorized } from "@/lib/authorize";

export async function POST(req: NextRequest) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth !== "ADMIN") return unAuthorized;
  const body = await req.json();
  if (body.query.trim() === "")
    return NextResponse.json({ error: "Please Provide query" });
  const result = await prisma.topic.findMany({
    where: {
      OR: [
        {
          title: {
            contains: body.query,
            mode: "insensitive",
          },
        },
        {
          subject: {
            name: {
              contains: body.query,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    include: { subject: { include: { class: true, section: true } } },
  });
  return NextResponse.json(result);
}

import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return unAuthorized;
  const assignments = await prisma.assignment.findFirst({
    where: {
      id: Number(params.id),
      visible: true,
    },
    include: {
      submissions: {
        include: {
          student: { include: { user: true } },
        },
      },
      _count: {
        select: {
          questions: true,
        },
      },
      questions: {
        include: {
          question: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });
  return NextResponse.json(assignments);
}

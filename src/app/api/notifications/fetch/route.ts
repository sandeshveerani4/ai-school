import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const fetched = await prisma.notificationMessage.findMany({
    where: {
      notifications: {
        some: {
          userId: auth.id,
        },
      },
    },
    include: {
      author: true,
      notifications: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(fetched);
}

export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const unread = await prisma.notificationMessage.count({
    where: {
      notifications: {
        some: {
          userId: auth.id,
          read: false,
        },
      },
    },
  });
  return NextResponse.json({ unread });
}

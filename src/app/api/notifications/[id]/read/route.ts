import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  await prisma.notification.update({
    where: {
      id: Number(params.id),
    },
    data: {
      read: true,
    },
  });
  return NextResponse.json({ success: true });
}

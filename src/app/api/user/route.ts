import { User, authorize, unAuthorized } from "@/lib/authorize";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  username: string;
  password: string;
}
export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const user = await prisma.user.findFirst({
    where: {
      id: auth.id,
    },
  });
  if (!user)
    return NextResponse.json({ error: "User not Found!" }, { status: 404 });
  const { password, ...result } = user;
  return new Response(JSON.stringify(result));
}

export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const body = await req.json();
  if (body.password && body.password.length < 8)
    return NextResponse.json(
      { error: "Password must be greater than 8 chars." },
      { status: 500 }
    );
  await prisma.user.update({
    data: {
      pictureURL: body.filename,
      ...(body.password && {
        password: await bcrypt.hash(body.password, 10),
      }),
    },
    where: {
      id: auth.id,
    },
  });
  return NextResponse.json({ success: true });
  /* const body: RequestBody = await request.json();

  const user = await prisma.user.create({
    data: {
      username: body.username,
      password: await bcrypt.hash(body.password, 10),
    },
  });

  const { password, ...result } = user;
  return new Response(JSON.stringify(result)); */
}

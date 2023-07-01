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
}
export async function POST(req: NextRequest) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth !== "ADMIN") return unAuthorized;
  const { data }: { data: RequestBody[] } = await req.json();
  try {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      const classId = (
        await prisma.class.findFirst({
          where: { name: String(element.class) },
        })
      )?.id;
      try {
        await prisma.user.create({
          data: {
            username: element.username,
            password: await bcrypt.hash(element.password, 10),
            role: "STUDENT",
            first_name: element.first_name,
            last_name: element.last_name,
            student: {
              create: {
                class: {
                  connect: {
                    id: classId,
                  },
                },
              },
            },
          },
        });
      } catch {}
    }
    // const { password, ...data } = result;
    return NextResponse.json({ success: true });
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

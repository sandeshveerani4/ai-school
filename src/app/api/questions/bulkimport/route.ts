import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { User, authorize, unAuthorized } from "@/lib/authorize";
export async function POST(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const { data, topicId }: { data: any; topicId: number } = await req.json();
  console.log({ data, topicId });
  try {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      try {
        console.log(
          await prisma.question.create({
            data: {
              question: element.question,
              score: Number(element.score) ?? 1,
              options: {
                createMany: {
                  data: Object.keys(element)
                    .filter((item) => {
                      return item.startsWith("option");
                    })
                    .map((item) => {
                      const correct =
                        item.split("option")[1].slice(-1).toLowerCase() ===
                        element["correct"].toLowerCase();
                      return { option: element[item], correct: correct };
                    }),
                },
              },
              topic: {
                connect: {
                  id: topicId,
                },
              },
            },
          })
        );
      } catch {}
    }
    // const { password, ...data } = result;
    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        return NextResponse.json(
          { error: "Username already exists!" },
          { status: 400 }
        );
      }
    }
  }
}

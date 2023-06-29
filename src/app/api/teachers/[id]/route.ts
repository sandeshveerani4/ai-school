import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authorize, unAuthorized } from "@/lib/authorize";
export const PUT = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth === "STUDENT") return unAuthorized;
  const { id, ...body } = await req.json();
  if (body["date_of_birth"] === "") body["date_of_birth"] = null;
  if (body["password"] === "") body["password"] = undefined;
  const result = await prisma.user.update({
    where: { id: Number(params.id) },
    data: {
      username: body.username,
      password: body.password,
      profile: {
        update: {
          first_name: body.first_name,
          last_name: body.last_name,
          date_of_birth: body.date_of_birth,
        },
      },
    },
  });
  return NextResponse.json(result);
};
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req);
  if (typeof auth === "object") return auth;
  if (auth === "STUDENT") return unAuthorized;
  const teachers = await prisma.user.findFirst({
    where: { role: "TEACHER", id: Number(params.id) },
    include: { profile: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(teachers);
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";
export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const { id, ...body } = await req.json();
  if (body["date_of_birth"] === "") body["date_of_birth"] = null;
  if (body["password"] === "") body["password"] = undefined;
  const result = await prisma.user.update({
    where: { id: Number(params.id) },
    data: {
      username: body.username,
      password: body.password,
      first_name: body.first_name,
      last_name: body.last_name,
      date_of_birth: body.date_of_birth,
    },
  });
  return NextResponse.json(result);
};
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  await prisma.user.deleteMany({
    where: { id: Number(params.id), role: "TEACHER" },
  });
  return NextResponse.json({ success: true });
}
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role === "STUDENT") return unAuthorized;
  const teachers = await prisma.user.findFirst({
    where: { role: "TEACHER", id: Number(params.id) },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(teachers);
}

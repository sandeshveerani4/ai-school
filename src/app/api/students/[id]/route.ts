import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const { id, ...body } = await req.json();
  if (body["date_of_birth"] === "") body["date_of_birth"] = undefined;
  if (body["password"] === "") body["password"] = undefined;
  const result = await prisma.user.update({
    where: { id: Number(params.id) },
    data: {
      username: body.username,
      password: body.password,
      first_name: body.first_name,
      last_name: body.last_name,
      date_of_birth: body.date_of_birth,
      student: {
        connectOrCreate: {
          create: {
            class: { connect: { id: Number(body.classId) } },
            section: { connect: { id: Number(body.sectionId) } },
          },
          where: {
            userId: Number(params.id),
          },
        },
      },
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
    where: { id: Number(params.id), role: "STUDENT" },
  });
  return NextResponse.json({ success: true });
}
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const students = await prisma.user.findFirst({
    where: { role: "STUDENT", id: Number(params.id) },
    include: { student: { include: { class: true } } },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(students);
}

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";
interface RequestBody {
  name: string;
  class: number;
  section: number;
  teacher: number;
}
export async function GET(
  req: NextRequest,
  { params }: { params: { id: number; sectionid: number } }
) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  if (auth.role !== "ADMIN") return unAuthorized;
  const students = await prisma.subject.findMany({
    where: {
      classId: Number(params.id),
      sectionId: Number(params.sectionid),
    },
    include: {
      class: true,
      section: true,
      teacher: { include: { user: true } },
    },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(students);
}

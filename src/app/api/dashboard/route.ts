import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const students = await prisma.student.count();
  const teachers = await prisma.teacher.count();
  const assignments = await prisma.assignment.count({
    ...(auth.role === "TEACHER" && { where: { userID: auth.id } }),
  });
  const questions = await prisma.question.count();
  const submissions = await prisma.submission.count();
  return NextResponse.json({
    students,
    teachers,
    assignments,
    questions,
    submissions,
  });
}

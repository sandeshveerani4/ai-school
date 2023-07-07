import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { User, authorize, unAuthorized } from "@/lib/authorize";

export async function GET(req: NextRequest) {
  const auth = authorize(req) as User;
  if (auth === unAuthorized) return auth;
  const students = await prisma.student.count();
  const teachers = await prisma.teacher.count();
  const assignments = await prisma.assignment.count();
  const questions = await prisma.question.count();
  return NextResponse.json({ students, teachers, assignments, questions });
}

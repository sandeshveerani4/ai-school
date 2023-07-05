import { NextResponse } from "next/server";
import { verifyJwt } from "./jwt";
import { JwtPayload } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
export type User = Prisma.UserGetPayload<{
  include: {
    student: true;
  };
}>;
export const unAuthorized: object = NextResponse.json(
  {
    error: "unauthorized",
  },
  {
    status: 401,
  }
);
export const authorize = (req: Request): User | object => {
  const accessToken = req.headers.get("authorization");
  if (accessToken) {
    const jwt = verifyJwt(accessToken);
    if (jwt) {
      return jwt as User;
    }
  }
  return unAuthorized;
};

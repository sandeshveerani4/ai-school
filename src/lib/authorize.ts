import { NextResponse } from "next/server";
import { verifyJwt } from "./jwt";
export const unAuthorized = NextResponse.json(
  {
    error: "unauthorized",
  },
  {
    status: 401,
  }
);
export const authorize = (req: Request) => {
  const accessToken = req.headers.get("authorization");
  if (accessToken) {
    const jwt = verifyJwt(accessToken);
    if (jwt) {
      return jwt.role;
    }
  }
  return unAuthorized;
};

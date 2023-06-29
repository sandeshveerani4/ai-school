export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
export async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const { pathname } = request.nextUrl;
  const adminPaths = [
    "/dashboard/students",
    "/dashboard/teachers",
    "/dashboard/classes",
  ];
  const matchesAdminPaths = adminPaths.some((path) =>
    pathname.startsWith(path)
  );
  const token = await getToken({ req: request });
  if (!token) {
    const url = new URL(`/login`, request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  const url = new URL(`/403`, request.url);
  if (matchesAdminPaths && token.role !== "ADMIN") NextResponse.rewrite(url);
  return NextResponse.next();
}
export const config = {
  matcher: ["/dashboard/:path*"],
};

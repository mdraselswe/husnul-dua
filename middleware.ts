import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";

// Protect admin-only PAGES. /add is public (open submissions). Write APIs do
// their own check in the route handlers.
const PROTECTED = [/^\/edit(\/|$)/, /^\/admin(\/|$)/];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!PROTECTED.some((re) => re.test(pathname))) return NextResponse.next();

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifyToken(token)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/edit/:path*", "/admin/:path*"],
};

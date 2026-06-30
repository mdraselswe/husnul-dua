import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const isAdmin = await verifyToken(token);
  return NextResponse.json({ isAdmin });
}

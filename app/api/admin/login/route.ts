import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_HINT_COOKIE,
  createToken,
  getAdminPassword,
  cookieOptions,
  hintCookieOptions,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  const adminPassword = getAdminPassword();
  if (!adminPassword) {
    return NextResponse.json(
      { error: "অ্যাডমিন পাসওয়ার্ড সার্ভারে সেট করা নেই (ADMIN_PASSWORD)।" },
      { status: 500 }
    );
  }

  let password = "";
  try {
    ({ password } = await request.json());
  } catch {
    /* ignore */
  }

  if (!password || password !== adminPassword) {
    return NextResponse.json({ error: "ভুল পাসওয়ার্ড।" }, { status: 401 });
  }

  const token = await createToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, cookieOptions);
  res.cookies.set(ADMIN_HINT_COOKIE, "1", hintCookieOptions);
  return res;
}

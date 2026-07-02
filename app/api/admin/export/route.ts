import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";

// GET - download all duas as JSON (admin only). Backup.
export async function GET(request: NextRequest) {
  if (!(await verifyToken(request.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
  }
  try {
    const duas = await prisma.dua.findMany({ orderBy: { createdAt: "asc" } });
    const body = JSON.stringify({ exportedAt: new Date().toISOString(), count: duas.length, duas }, null, 2);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="husnul-dua-backup.json"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Export failed", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

// GET - unique category list (across all duas, any status)
export async function GET() {
  try {
    const duas = await prisma.dua.findMany({ select: { category: true } });
    const set = new Set<string>();
    duas.forEach((d) => {
      const c = d.category?.trim();
      if (c) set.add(c);
    });
    return NextResponse.json(Array.from(set).sort());
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

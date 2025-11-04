import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

// GET - Get all tags
export async function GET() {
  try {
    const duas = await prisma.dua.findMany({
      select: { tags: true },
    });

    // Extract all unique tags
    const allTags = new Set<string>();
    duas.forEach((dua) => {
      dua.tags.split(",").forEach((tag) => {
        const trimmed = tag.trim().toLowerCase();
        if (trimmed) allTags.add(trimmed);
      });
    });

    return NextResponse.json(Array.from(allTags).sort());
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch tags",
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

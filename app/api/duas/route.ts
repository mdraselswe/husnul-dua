import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";

// GET - Search duas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const tag = searchParams.get("tag") || "";
    const category = searchParams.get("category") || "";

    let where: any = {};

    if (query) {
      where.OR = [
        { titleBengali: { contains: query } },
        { arabic: { contains: query } },
        { transliteration: { contains: query, mode: "insensitive" } },
        { bengali: { contains: query } },
        { tags: { contains: query } },
      ];
    }

    if (tag) {
      where.tags = { contains: tag };
    }

    if (category) {
      where.category = category;
    }

    const duas = await prisma.dua.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(duas);
  } catch (error: any) {
    console.error("Error fetching duas:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch duas",
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        hint: error.message?.includes('DATABASE_URL') ? 'DATABASE_URL environment variable not set' : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Add new dua
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      titleBengali,
      titleEnglish,
      arabic,
      transliteration,
      bengali,
      english,
      tags,
      category,
      source,
      times,
      benefits,
    } = body;

    if (!titleBengali || !arabic || !transliteration || !bengali || !tags) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const dua = await prisma.dua.create({
      data: {
        titleBengali,
        titleEnglish,
        arabic,
        transliteration,
        bengali,
        english,
        tags,
        category,
        source,
        times,
        benefits,
      },
    });

    return NextResponse.json(dua, { status: 201 });
  } catch (error: any) {
    console.error("Error creating dua:", error);
    return NextResponse.json(
      { 
        error: "Failed to create dua",
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

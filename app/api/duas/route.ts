import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";

// GET - Search duas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const tag = searchParams.get("tag") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";

    const where: any = {};

    // Moderation visibility: public sees only "approved". Pending/all requires admin.
    if (status === "pending" || status === "all") {
      if (!(await verifyToken(request.cookies.get(ADMIN_COOKIE)?.value))) {
        return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
      }
      if (status === "pending") where.status = "pending";
    } else {
      where.status = "approved";
    }

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
        message: error.message,
        code: error.code,
        hint: error.message?.includes('DATABASE_URL') ? 'DATABASE_URL environment variable not set' : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Submit a dua. Anyone may submit; public goes to the pending queue,
// admin submissions are auto-approved.
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyToken(
      request.cookies.get(ADMIN_COOKIE)?.value
    );

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

    if (!titleBengali || !bengali || !tags) {
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
        status: isAdmin ? "approved" : "pending",
      },
    });

    return NextResponse.json({ ...dua, pending: !isAdmin }, { status: 201 });
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

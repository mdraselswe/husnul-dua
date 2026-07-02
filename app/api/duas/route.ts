import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/prisma/client";
import { prisma } from "@/lib/prisma-client";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";
import { cleanSegments } from "@/lib/segments";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

// Best-effort in-memory rate limit for public submissions (no external service).
// Per-instance only; resets on cold start — enough to deter casual spam.
const submitHits = new Map<string, number[]>();
function rateLimited(ip: string, max = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const hits = (submitHits.get(ip) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    submitHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  submitHits.set(ip, hits);
  return false;
}

// GET - Search duas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const tag = searchParams.get("tag") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";

    const where: Prisma.DuaWhereInput = {};

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

    // Never expose the private edit token in list responses.
    duas.forEach((d) => {
      delete (d as { editToken?: string | null }).editToken;
    });
    return NextResponse.json(duas);
  } catch (error) {
    console.error("Error fetching duas:", error);
    return NextResponse.json(
      { error: "Failed to fetch duas", message: errMsg(error) },
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

    if (!isAdmin) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown";
      if (rateLimited(ip)) {
        return NextResponse.json(
          { error: "অনেকবার জমা দিয়েছেন। কিছুক্ষণ পর আবার চেষ্টা করুন।" },
          { status: 429 }
        );
      }
    }

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
      fojilot,
      rules,
      context,
      quranRef,
      videoUrl,
      articleUrl,
      segments,
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
        fojilot,
        rules,
        context,
        quranRef,
        videoUrl,
        articleUrl,
        segments: cleanSegments(segments),
        status: isAdmin ? "approved" : "pending",
        // Anonymous submitters get a secret token to view/edit their pending dua.
        editToken: isAdmin ? null : crypto.randomUUID(),
      },
    });

    return NextResponse.json(
      { id: dua.id, editToken: dua.editToken, pending: !isAdmin },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating dua:", error);
    return NextResponse.json(
      { error: "Failed to create dua", message: errMsg(error) },
      { status: 500 }
    );
  }
}

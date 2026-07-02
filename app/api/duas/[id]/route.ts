import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";
import { cleanSegments } from "@/lib/segments";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));
const errCode = (e: unknown) => (e as { code?: string })?.code;

async function isAdmin(request: NextRequest) {
  return verifyToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

// GET - single dua
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dua = await prisma.dua.findUnique({ where: { id } });
    if (!dua) {
      return NextResponse.json({ error: "দুআ পাওয়া যায়নি" }, { status: 404 });
    }
    return NextResponse.json(dua);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dua", message: errMsg(error) },
      { status: 500 }
    );
  }
}

// PUT - update dua (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
    }
    const { id } = await params;
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
        { error: "আবশ্যকীয় ক্ষেত্র অনুপস্থিত" },
        { status: 400 }
      );
    }

    const dua = await prisma.dua.update({
      where: { id },
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
      },
    });
    return NextResponse.json(dua);
  } catch (error) {
    if (errCode(error) === "P2025") {
      return NextResponse.json({ error: "দুআ পাওয়া যায়নি" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update dua", message: errMsg(error) },
      { status: 500 }
    );
  }
}

// PATCH - moderate a submission (admin only): approve, or reject with a reason.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const data =
      body.action === "reject"
        ? { status: "rejected", rejectReason: body.reason || null }
        : { status: "approved", rejectReason: null };
    const dua = await prisma.dua.update({ where: { id }, data });
    return NextResponse.json(dua);
  } catch (error) {
    if (errCode(error) === "P2025") {
      return NextResponse.json({ error: "দুআ পাওয়া যায়নি" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to approve dua", message: errMsg(error) },
      { status: 500 }
    );
  }
}

// DELETE - delete dua (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
    }
    const { id } = await params;
    await prisma.dua.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (errCode(error) === "P2025") {
      return NextResponse.json({ error: "দুআ পাওয়া যায়নি" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete dua", message: errMsg(error) },
      { status: 500 }
    );
  }
}

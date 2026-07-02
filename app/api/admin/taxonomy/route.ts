import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma-client";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";

const norm = (s: string) => s.trim().replace(/\s+/g, " ");
const key = (s: string) => norm(s).toLowerCase();
const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e));

async function isAdmin(request: NextRequest) {
  return verifyToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

// GET - list all categories and tags with usage counts (admin).
export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
  }
  try {
    const duas = await prisma.dua.findMany({ select: { category: true, tags: true } });
    const cats = new Map<string, number>();
    const tags = new Map<string, number>();
    for (const d of duas) {
      const c = d.category?.trim();
      if (c) cats.set(c, (cats.get(c) || 0) + 1);
      for (const t of (d.tags || "").split(",")) {
        const v = t.trim();
        if (v) tags.set(v, (tags.get(v) || 0) + 1);
      }
    }
    const toArr = (m: Map<string, number>) =>
      Array.from(m.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    return NextResponse.json({ categories: toArr(cats), tags: toArr(tags) });
  } catch (error) {
    return NextResponse.json({ error: "Failed", message: errMsg(error) }, { status: 500 });
  }
}

// PATCH - rename (or delete with empty `to`) a category/tag across all duas.
export async function PATCH(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "অননুমোদিত" }, { status: 401 });
  }
  try {
    const { kind, from, to } = await request.json();
    const fromN = norm(from || "");
    const toN = norm(to || "");
    if (!kind || !fromN) {
      return NextResponse.json({ error: "অসম্পূর্ণ তথ্য" }, { status: 400 });
    }

    if (kind === "category") {
      const res = await prisma.dua.updateMany({
        where: { category: fromN },
        data: { category: toN || null },
      });
      return NextResponse.json({ updated: res.count });
    }

    if (kind === "tag") {
      // Fetch candidates broadly, then replace only exact tokens.
      const candidates = await prisma.dua.findMany({
        where: { tags: { contains: fromN } },
        select: { id: true, tags: true },
      });
      let updated = 0;
      for (const d of candidates) {
        const tokens = (d.tags || "").split(",").map(norm).filter(Boolean);
        if (!tokens.some((t) => key(t) === key(fromN))) continue;
        const seen = new Set<string>();
        const next: string[] = [];
        for (const t of tokens) {
          const replaced = key(t) === key(fromN) ? toN : t;
          if (!replaced || seen.has(key(replaced))) continue;
          seen.add(key(replaced));
          next.push(replaced);
        }
        await prisma.dua.update({ where: { id: d.id }, data: { tags: next.join(", ") } });
        updated++;
      }
      return NextResponse.json({ updated });
    }

    return NextResponse.json({ error: "অজানা টাইপ" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed", message: errMsg(error) }, { status: 500 });
  }
}

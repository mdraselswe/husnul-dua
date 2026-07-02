import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma-client";
import AmolClient from "@/components/AmolClient";
import type { Dua } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = { title: "আমল মোড" };

export default async function AmolPage() {
  let duas: Dua[] = [];
  try {
    const rows = await prisma.dua.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "asc" },
    });
    duas = JSON.parse(JSON.stringify(rows));
  } catch (e) {
    console.error("Amol fetch failed:", e);
  }

  return (
    <div className="min-h-screen">
      <header className="bg-mesh relative overflow-hidden text-white shadow-lg">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <Link
            href="/"
            className="mb-3 flex items-center gap-2 font-bengali text-sm text-white/90 transition hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            হোমে ফিরুন
          </Link>
          <h1 className="font-bengali text-2xl font-bold">আমল মোড</h1>
          <p className="font-bengali text-sm text-white/80">
            বিভাগ ধরে দুআগুলো একের পর এক পড়ুন।
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <AmolClient initial={duas} />
      </main>
    </div>
  );
}

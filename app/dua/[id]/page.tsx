import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma-client";
import DuaCard from "@/components/DuaCard";
import PrintButton from "@/components/PrintButton";
import type { Dua } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getDua(id: string): Promise<Dua | null> {
  try {
    const dua = await prisma.dua.findUnique({ where: { id } });
    if (!dua || dua.status !== "approved") return null;
    return JSON.parse(JSON.stringify(dua));
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const dua = await getDua(id);
  if (!dua) return { title: "দুআ পাওয়া যায়নি" };
  return {
    title: dua.titleBengali,
    description: dua.bengali?.slice(0, 150),
  };
}

export default async function DuaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dua = await getDua(id);

  return (
    <div className="min-h-screen">
      <header className="bg-mesh relative overflow-hidden text-white shadow-lg print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-5">
          <Link
            href="/"
            className="flex items-center gap-2 font-bengali text-sm text-white/90 transition hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            সব দুআ
          </Link>
          {dua && <PrintButton />}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {dua ? (
          <DuaCard dua={dua} />
        ) : (
          <div className="glass rounded-3xl px-6 py-16 text-center">
            <p className="mb-4 font-bengali text-lg text-muted">
              দুআটি পাওয়া যায়নি।
            </p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-primary px-5 py-2.5 font-bengali font-semibold text-primary-fg"
            >
              হোমে ফিরুন
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

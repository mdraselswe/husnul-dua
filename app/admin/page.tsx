import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Download,
  FileCheck,
  FileClock,
  FileX,
  Layers,
  Plus,
} from "lucide-react";
import { prisma } from "@/lib/prisma-client";

export const dynamic = "force-dynamic";
export const metadata = { title: "অ্যাডমিন" };

async function getStats() {
  try {
    const [approved, pending, rejected, cats] = await Promise.all([
      prisma.dua.count({ where: { status: "approved" } }),
      prisma.dua.count({ where: { status: "pending" } }),
      prisma.dua.count({ where: { status: "rejected" } }),
      prisma.dua.findMany({ select: { category: true } }),
    ]);
    const categories = new Set(
      cats.map((c) => c.category?.trim()).filter(Boolean)
    ).size;
    return { approved, pending, rejected, categories };
  } catch {
    return { approved: 0, pending: 0, rejected: 0, categories: 0 };
  }
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-4">
      <span
        className={`grid h-11 w-11 place-items-center rounded-xl ${
          accent ? "bg-accent-soft text-accent" : "bg-primary-soft text-primary-strong"
        }`}
      >
        {icon}
      </span>
      <span>
        <span className="block font-bengali text-2xl font-bold leading-none text-foreground tabular-nums">
          {value}
        </span>
        <span className="block font-bengali text-sm text-muted">{label}</span>
      </span>
    </div>
  );
}

export default async function AdminDashboard() {
  const s = await getStats();
  return (
    <div className="min-h-screen">
      <header className="bg-mesh relative overflow-hidden text-white shadow-lg">
        <div className="mx-auto max-w-4xl px-4 py-5">
          <Link
            href="/"
            className="mb-3 flex items-center gap-2 font-bengali text-sm text-white/90 transition hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            হোমে ফিরুন
          </Link>
          <h1 className="font-bengali text-2xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={<FileCheck className="h-5 w-5" />} label="অনুমোদিত" value={s.approved} />
          <Stat icon={<FileClock className="h-5 w-5" />} label="অপেক্ষমাণ" value={s.pending} accent />
          <Stat icon={<FileX className="h-5 w-5" />} label="বাতিল" value={s.rejected} />
          <Stat icon={<Layers className="h-5 w-5" />} label="বিভাগ" value={s.categories} />
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/pending"
            className="glass flex items-center gap-3 rounded-2xl px-5 py-4 transition hover:shadow-md"
          >
            <ClipboardList className="h-6 w-6 text-primary" />
            <span className="flex-1 font-bengali font-semibold text-foreground">
              পর্যালোচনা কিউ
            </span>
            {s.pending > 0 && (
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-accent px-1.5 font-bengali text-sm font-bold text-[#1a1304]">
                {s.pending}
              </span>
            )}
          </Link>

          <Link
            href="/add"
            className="glass flex items-center gap-3 rounded-2xl px-5 py-4 transition hover:shadow-md"
          >
            <Plus className="h-6 w-6 text-primary" />
            <span className="font-bengali font-semibold text-foreground">
              নতুন দুআ যোগ
            </span>
          </Link>

          <a
            href="/api/admin/export"
            className="glass flex items-center gap-3 rounded-2xl px-5 py-4 transition hover:shadow-md"
          >
            <Download className="h-6 w-6 text-primary" />
            <span className="font-bengali font-semibold text-foreground">
              ডেটা ব্যাকআপ (JSON)
            </span>
          </a>
        </section>
      </main>
    </div>
  );
}

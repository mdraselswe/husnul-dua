"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, BookOpenCheck, ClipboardCheck, LogIn, LogOut, Plus } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import FontSizeControl from "./FontSizeControl";
import { useAdmin } from "./AdminProvider";

export default function Header({ subtitle }: { subtitle?: string }) {
  const { isAdmin, logout } = useAdmin();
  const router = useRouter();
  const [pending, setPending] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      setPending(0);
      return;
    }
    fetch("/api/duas?status=pending")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setPending(Array.isArray(d) ? d.length : 0))
      .catch(() => setPending(0));
  }, [isAdmin]);

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <header className="bg-mesh relative overflow-hidden text-white shadow-lg">
      <div className="relative mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-5">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 transition group-hover:scale-105">
            <BookOpen className="h-6 w-6" />
          </span>
          <span>
            <span className="block font-bengali text-2xl font-bold leading-tight">
              হুসনুল দুআ
            </span>
            <span className="block font-bengali text-xs text-white/80">
              {subtitle ?? "ইসলামিক দুআ, আমল ও জিকিরের সংগ্রহ"}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/amol"
            aria-label="আমল মোড"
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 font-bengali text-sm font-semibold transition hover:bg-white/25"
          >
            <BookOpenCheck className="h-4 w-4" />
            <span className="hidden sm:inline">আমল</span>
          </Link>
          <Link
            href="/add"
            className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 font-bengali text-sm font-semibold transition hover:bg-white/25"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">নতুন দুআ</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin/pending"
              aria-label="পর্যালোচনা"
              className="relative grid h-10 w-10 place-items-center rounded-full bg-white/15 transition hover:bg-white/25 active:scale-90"
            >
              <ClipboardCheck className="h-5 w-5" />
              {pending > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-[#1a1304]">
                  {pending}
                </span>
              )}
            </Link>
          )}

          {isAdmin ? (
            <button
              onClick={handleLogout}
              aria-label="লগআউট"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/15 transition hover:bg-white/25 active:scale-90"
            >
              <LogOut className="h-5 w-5" />
            </button>
          ) : (
            <Link
              href="/login"
              aria-label="অ্যাডমিন লগইন"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/15 transition hover:bg-white/25 active:scale-90"
            >
              <LogIn className="h-5 w-5" />
            </Link>
          )}
          <div className="hidden sm:block">
            <FontSizeControl />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

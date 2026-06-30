"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Inbox,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";
import type { Dua } from "@/lib/types";

export default function PendingReviewPage() {
  const router = useRouter();
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/duas?status=pending")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setDuas(Array.isArray(d) ? d : []))
      .catch(() => setDuas([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const approve = async (id: string) => {
    setBusy(id);
    const res = await fetch(`/api/duas/${id}`, { method: "PATCH" });
    if (res.ok) setDuas((d) => d.filter((x) => x.id !== id));
    setBusy(null);
  };

  const reject = async (id: string, title: string) => {
    if (!confirm(`"${title}" দুআটি বাতিল ও মুছে ফেলবেন?`)) return;
    setBusy(id);
    const res = await fetch(`/api/duas/${id}`, { method: "DELETE" });
    if (res.ok) setDuas((d) => d.filter((x) => x.id !== id));
    setBusy(null);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-mesh relative overflow-hidden text-white shadow-lg">
        <div className="mx-auto max-w-4xl px-4 py-5">
          <button
            onClick={() => router.push("/")}
            className="mb-3 flex items-center gap-2 font-bengali text-sm text-white/90 transition hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            হোমে ফিরুন
          </button>
          <h1 className="font-bengali text-2xl font-bold">
            পর্যালোচনার অপেক্ষায়
          </h1>
          <p className="font-bengali text-sm text-white/80">
            ব্যবহারকারীদের জমা দেওয়া দুআ অনুমোদন বা বাতিল করুন।
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : duas.length === 0 ? (
          <div className="animate-fade-in rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
            <Inbox className="mx-auto mb-3 h-8 w-8 text-primary/60" />
            <p className="font-bengali text-lg text-muted">
              অপেক্ষমাণ কোনো দুআ নেই।
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="font-bengali text-sm text-muted">
              {duas.length}টি দুআ অপেক্ষমাণ
            </p>
            {duas.map((dua) => (
              <article
                key={dua.id}
                className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
              >
                <div className="space-y-3 px-5 py-5">
                  <h2 className="font-bengali text-xl font-bold text-foreground">
                    {dua.titleBengali}
                  </h2>
                  {dua.arabic && (
                    <p className="font-arabic text-2xl leading-loose text-foreground">
                      {dua.arabic}
                    </p>
                  )}
                  {dua.transliteration && (
                    <p className="italic text-muted">{dua.transliteration}</p>
                  )}
                  <p className="font-bengali leading-relaxed text-foreground">
                    {dua.bengali}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dua.tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-primary-soft px-3 py-1 font-bengali text-xs font-medium text-primary-strong"
                        >
                          {t}
                        </span>
                      ))}
                  </div>
                  {dua.source && (
                    <p className="font-bengali text-sm text-muted">
                      <span className="font-semibold text-foreground">উৎস:</span>{" "}
                      {dua.source}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-border bg-surface-2/40 px-5 py-3">
                  <button
                    onClick={() => approve(dua.id)}
                    disabled={busy === dua.id}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 font-bengali text-sm font-semibold text-primary-fg transition hover:bg-primary-strong disabled:opacity-60"
                  >
                    {busy === dua.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    অনুমোদন
                  </button>
                  <button
                    onClick={() => router.push(`/edit/${dua.id}`)}
                    className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-4 py-2 font-bengali text-sm font-semibold text-foreground transition hover:opacity-80"
                  >
                    <Pencil className="h-4 w-4" />
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => reject(dua.id, dua.titleBengali)}
                    disabled={busy === dua.id}
                    className="ml-auto flex items-center gap-1.5 rounded-lg px-4 py-2 font-bengali text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:hover:bg-red-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                    বাতিল
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

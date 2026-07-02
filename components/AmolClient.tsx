"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import DuaCard from "@/components/DuaCard";
import { categoryIcon } from "@/lib/categoryIcons";
import type { Dua } from "@/lib/types";

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number) => String(n).replace(/\d/g, (d) => BN[Number(d)]);

export default function AmolClient({ initial }: { initial: Dua[] }) {
  const [category, setCategory] = useState("");
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());

  const groups = useMemo(() => {
    const m = new Map<string, Dua[]>();
    for (const d of initial) {
      const c = d.category?.trim() || "অন্যান্য";
      if (!m.has(c)) m.set(c, []);
      m.get(c)!.push(d);
    }
    return Array.from(m.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [initial]);

  const list = useMemo(
    () => (category ? initial.filter((d) => (d.category?.trim() || "অন্যান্য") === category) : []),
    [initial, category]
  );

  const start = (c: string) => {
    setCategory(c);
    setIndex(0);
    setDone(new Set());
  };

  const markAndNext = () => {
    const cur = list[index];
    if (cur) setDone((s) => new Set(s).add(cur.id));
    if (index + 1 < list.length) setIndex((i) => i + 1);
  };

  // Category picker
  if (!category) {
    return (
      <div className="space-y-3">
        <p className="mb-2 font-bengali text-sm text-muted">
          একটি বিভাগ বেছে নিন — দুআগুলো একের পর এক পড়ুন।
        </p>
        {groups.length === 0 && (
          <div className="glass rounded-2xl px-6 py-12 text-center font-bengali text-muted">
            কোনো দুআ নেই।
          </div>
        )}
        {groups.map(([c, items]) => (
          <button
            key={c}
            onClick={() => start(c)}
            className="glass flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left transition hover:shadow-md"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-2xl">
              {categoryIcon(c)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bengali text-lg font-bold text-foreground">
                {c}
              </span>
              <span className="block font-bengali text-sm text-muted">
                {toBn(items.length)}টি দুআ
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
          </button>
        ))}
      </div>
    );
  }

  const current = list[index];
  const finished = done.size >= list.length && list.length > 0;
  const progress = list.length ? ((index + 1) / list.length) * 100 : 0;

  return (
    <div>
      <button
        onClick={() => setCategory("")}
        className="mb-4 flex items-center gap-1.5 font-bengali text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        বিভাগ পরিবর্তন
      </button>

      {/* Progress */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between font-bengali text-sm">
          <span className="flex items-center gap-1.5 font-semibold text-foreground">
            <span>{categoryIcon(category)}</span>
            {category}
          </span>
          <span className="text-muted">
            {toBn(index + 1)} / {toBn(list.length)}
            {done.size > 0 && ` · ${toBn(done.size)} ✓`}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </div>
      </div>

      {finished ? (
        <div className="glass rounded-3xl px-6 py-14 text-center">
          <Check className="mx-auto mb-3 h-12 w-12 text-primary" />
          <h2 className="mb-2 font-bengali text-xl font-bold text-foreground">
            মাশা-আল্লাহ, সম্পন্ন হয়েছে!
          </h2>
          <p className="mb-6 font-bengali text-muted">
            এই বিভাগের সব দুআ পড়া হয়েছে।
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => start(category)}
              className="flex items-center gap-1.5 rounded-xl bg-surface-2 px-5 py-2.5 font-bengali font-semibold text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
              আবার
            </button>
            <button
              onClick={() => setCategory("")}
              className="rounded-xl bg-primary px-5 py-2.5 font-bengali font-semibold text-primary-fg"
            >
              অন্য বিভাগ
            </button>
          </div>
        </div>
      ) : (
        current && (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
              >
                <DuaCard dua={current} />
              </motion.div>
            </AnimatePresence>

            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                disabled={index === 0}
                className="flex items-center gap-1 rounded-xl bg-surface-2 px-4 py-3 font-bengali font-semibold text-foreground transition disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
                আগে
              </button>
              <button
                onClick={markAndNext}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bengali font-semibold text-primary-fg shadow glow-primary"
              >
                <Check className="h-5 w-5" />
                {index + 1 < list.length ? "পড়া হয়েছে, পরের দুআ" : "পড়া হয়েছে, শেষ"}
              </button>
            </div>
          </>
        )
      )}

      <p className="mt-6 text-center">
        <Link href="/" className="font-bengali text-sm text-muted hover:text-foreground">
          হোমে ফিরুন
        </Link>
      </p>
    </div>
  );
}

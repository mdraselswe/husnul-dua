"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Heart,
  Pencil,
  RotateCcw,
  Share2,
  Trash2,
} from "lucide-react";
import type { Dua } from "@/lib/types";
import { useFavorites } from "./useFavorites";
import { useAdmin } from "./AdminProvider";

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number) =>
  String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

function parseTarget(times?: string): number | null {
  if (!times) return null;
  let s = times;
  BN_DIGITS.forEach((d, i) => (s = s.split(d).join(String(i))));
  const m = s.match(/\d+/);
  const n = m ? Number(m[0]) : NaN;
  return n > 0 && n <= 1000 ? n : null;
}

export default function DuaCard({ dua, index = 0 }: { dua: Dua; index?: number }) {
  const router = useRouter();
  const { isFavorite, toggle } = useFavorites();
  const { isAdmin } = useAdmin();
  const fav = isFavorite(dua.id);

  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [burst, setBurst] = useState(false);
  const target = parseTarget(dua.times);

  useEffect(() => {
    try {
      setCount(Number(localStorage.getItem(`hd_count_${dua.id}`)) || 0);
    } catch {
      /* ignore */
    }
  }, [dua.id]);

  const setStoredCount = (n: number) => {
    setCount(n);
    try {
      localStorage.setItem(`hd_count_${dua.id}`, String(n));
    } catch {
      /* ignore */
    }
  };

  const toggleFav = () => {
    if (!fav) {
      setBurst(true);
      setTimeout(() => setBurst(false), 500);
    }
    toggle(dua.id);
  };

  const fullText = [
    dua.titleBengali,
    dua.arabic,
    dua.transliteration,
    dua.bengali,
    dua.source ? `— ${dua.source}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: dua.titleBengali, text: fullText });
      } catch {
        /* cancelled */
      }
    } else {
      handleCopy();
    }
  };

  const handleDelete = async () => {
    if (!confirm(`"${dua.titleBengali}" দুআটি মুছে ফেলবেন?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/duas/${dua.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else {
      setDeleting(false);
      alert("মুছে ফেলতে সমস্যা হয়েছে।");
    }
  };

  const reached = target != null && count >= target;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index, 10) * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -5 }}
      className="glass group overflow-hidden rounded-3xl shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      {/* Header strip */}
      <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
        <div className="min-w-0">
          <h2 className="font-bengali text-xl font-bold text-foreground">
            {dua.titleBengali}
          </h2>
          {dua.titleEnglish && (
            <p className="text-sm text-muted">{dua.titleEnglish}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={toggleFav}
            aria-label="প্রিয়"
            className="relative grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-surface-2"
          >
            <Heart
              className={`h-5 w-5 transition ${
                fav ? "fill-red-500 text-red-500" : ""
              }`}
            />
            {burst && (
              <span className="animate-burst pointer-events-none absolute inset-0 rounded-full border-2 border-red-400" />
            )}
          </motion.button>
          {isAdmin && (
            <>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => router.push(`/edit/${dua.id}`)}
                aria-label="সম্পাদনা"
                className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-surface-2"
              >
                <Pencil className="h-[18px] w-[18px]" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleDelete}
                disabled={deleting}
                aria-label="মুছুন"
                className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-[18px] w-[18px]" />
              </motion.button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4 px-5 py-5">
        {dua.arabic && (
          <p className="font-arabic text-3xl leading-[2.2] text-foreground">
            {dua.arabic}
          </p>
        )}

        {dua.transliteration && (
          <div className="rounded-xl bg-surface-2/70 px-4 py-3">
            <p className="italic leading-relaxed text-muted">
              {dua.transliteration}
            </p>
          </div>
        )}

        <p className="border-r-4 border-primary/40 pr-4 font-bengali text-lg leading-relaxed text-foreground">
          {dua.bengali}
        </p>

        {dua.english && (
          <p className="leading-relaxed text-muted">{dua.english}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {dua.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-primary-soft px-3 py-1 font-bengali text-xs font-medium text-primary-strong"
              >
                {tag}
              </span>
            ))}
        </div>

        {(dua.source || dua.times || dua.benefits) && (
          <div className="space-y-1.5 border-t border-border/60 pt-4 text-sm text-muted">
            {dua.source && (
              <p>
                <span className="font-bengali font-semibold text-foreground">
                  উৎস:
                </span>{" "}
                <span className="font-bengali">{dua.source}</span>
              </p>
            )}
            {dua.times && (
              <p>
                <span className="font-bengali font-semibold text-foreground">
                  পড়ার সময়/সংখ্যা:
                </span>{" "}
                <span className="font-bengali">{dua.times}</span>
              </p>
            )}
            {dua.benefits && (
              <p className="font-bengali leading-relaxed">
                <span className="font-semibold text-foreground">ফায়েদা:</span>{" "}
                {dua.benefits}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border/60 bg-surface-2/30 px-5 py-3">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bengali text-sm text-muted transition hover:bg-surface-2 hover:text-foreground"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="ok"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex items-center gap-1.5 text-primary"
              >
                <Check className="h-4 w-4" /> কপি হয়েছে
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="h-4 w-4" /> কপি
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bengali text-sm text-muted transition hover:bg-surface-2 hover:text-foreground"
        >
          <Share2 className="h-4 w-4" />
          শেয়ার
        </motion.button>

        <div className="ml-auto flex items-center gap-2">
          {count > 0 && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => setStoredCount(0)}
              aria-label="রিসেট"
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-surface-2"
            >
              <RotateCcw className="h-4 w-4" />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setStoredCount(count + 1)}
            animate={reached ? { scale: [1, 1.12, 1] } : {}}
            className={`relative flex items-center gap-2 overflow-hidden rounded-full px-4 py-1.5 font-bengali text-sm font-semibold tabular-nums transition ${
              reached
                ? "bg-accent text-[#1a1304] glow-primary"
                : "bg-primary text-primary-fg glow-primary hover:bg-primary-strong"
            }`}
          >
            <span className="text-base">📿</span>
            <motion.span key={count} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              {toBn(count)}
            </motion.span>
            {target != null && (
              <span className="opacity-80">/ {toBn(target)}</span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

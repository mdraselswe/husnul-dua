"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Flame, Heart, Layers, ListChecks, Sparkles } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import DuaCard from "@/components/DuaCard";
import Header from "@/components/Header";
import PrayerTimes from "@/components/PrayerTimes";
import ChipCarousel from "@/components/ChipCarousel";
import { useFavorites } from "@/components/useFavorites";
import { useStreak } from "@/components/useStreak";
import { categoryIcon } from "@/lib/categoryIcons";
import { matchesQuery } from "@/lib/search";
import type { Dua } from "@/lib/types";

function Chip({
  active,
  onClick,
  pill,
  children,
}: {
  active: boolean;
  onClick: () => void;
  pill?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`relative shrink-0 snap-start whitespace-nowrap rounded-full px-4 py-2 font-bengali text-sm font-medium transition ${
        active ? "text-primary-fg" : "bg-surface/70 text-muted ring-1 ring-border hover:text-foreground"
      }`}
    >
      {active && (
        <motion.span
          layoutId={pill}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="absolute inset-0 rounded-full bg-primary glow-primary"
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </motion.button>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass flex items-center gap-2.5 rounded-2xl px-3 py-3"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-strong">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-bengali text-lg font-bold leading-none text-foreground tabular-nums">
          {value}
        </span>
        <span className="block truncate font-bengali text-xs text-muted">
          {label}
        </span>
      </span>
    </motion.div>
  );
}

export default function HomeClient({ initial }: { initial: Dua[] }) {
  const [duas] = useState<Dua[]>(initial);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const [category, setCategory] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const { favorites } = useFavorites();
  const streak = useStreak();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(duas.map((d) => d.category?.trim()).filter(Boolean))) as string[],
    [duas]
  );

  const tags = useMemo(() => {
    const set = new Set<string>();
    duas.forEach((d) =>
      d.tags.split(",").forEach((t) => {
        const v = t.trim();
        if (v) set.add(v);
      })
    );
    return Array.from(set).slice(0, 12);
  }, [duas]);

  const anyFilter = !!(query || tag || category || favOnly);

  const todaysDua = useMemo(() => {
    if (duas.length === 0) return null;
    const d = new Date();
    const dayNum = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
    return duas[dayNum % duas.length];
  }, [duas]);

  const filtered = useMemo(() => {
    return duas.filter((d) => {
      if (favOnly && !favorites.includes(d.id)) return false;
      if (category && d.category?.trim() !== category) return false;
      if (tag && !d.tags.toLowerCase().includes(tag.toLowerCase())) return false;
      if (query) {
        const hay = [
          d.titleBengali,
          d.titleEnglish,
          d.arabic,
          d.transliteration,
          d.bengali,
          d.english,
          d.tags,
        ]
          .filter(Boolean)
          .join(" ");
        if (!matchesQuery(hay, query)) return false;
      }
      return true;
    });
  }, [duas, query, tag, category, favOnly, favorites]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <Stat icon={<ListChecks className="h-5 w-5" />} label="মোট দুআ" value={duas.length} />
          <Stat icon={<Layers className="h-5 w-5" />} label="বিভাগ" value={categories.length} />
          <Stat icon={<Heart className="h-5 w-5" />} label="প্রিয়" value={favorites.length} />
          <Stat icon={<Flame className="h-5 w-5" />} label="দিন ধারাবাহিক" value={streak} />
        </motion.section>

        {/* Prayer times */}
        <div className="mb-4">
          <PrayerTimes />
        </div>

        {/* Today's dua */}
        {!anyFilter && todaysDua && (
          <Link href={`/dua/${todaysDua.id}`} className="mb-5 block">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }}
              className="glass overflow-hidden rounded-2xl border-l-4 border-accent p-5"
            >
              <div className="mb-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="font-bengali text-xs font-semibold uppercase tracking-wide text-accent">
                  আজকের দুআ
                </span>
              </div>
              <h3 className="font-bengali text-lg font-bold text-foreground">
                {todaysDua.titleBengali}
              </h3>
              <p className="line-clamp-2 font-bengali text-sm text-muted">
                {todaysDua.bengali}
              </p>
            </motion.div>
          </Link>
        )}

        {/* Search */}
        <div className="sticky top-3 z-20 mb-4">
          <div className="glass rounded-2xl p-1.5">
            <SearchBar value={query} onChange={setQuery} />
          </div>
        </div>

        {/* Favorites + categories */}
        <ChipCarousel className="mb-3">
          <Chip active={favOnly} onClick={() => setFavOnly((v) => !v)}>
            <Heart className={`h-4 w-4 ${favOnly ? "fill-current" : ""}`} />
            প্রিয় {favorites.length > 0 && `(${favorites.length})`}
          </Chip>
          {categories.map((c) => (
            <Chip key={c} pill="pill-cat" active={category === c} onClick={() => setCategory(category === c ? "" : c)}>
              <span aria-hidden>{categoryIcon(c)}</span>
              {c}
            </Chip>
          ))}
        </ChipCarousel>

        {/* Tags */}
        {tags.length > 0 && (
          <ChipCarousel className="mb-6">
            <Chip pill="pill-tag" active={!tag} onClick={() => setTag("")}>
              সব
            </Chip>
            {tags.map((t) => (
              <Chip key={t} pill="pill-tag" active={tag === t} onClick={() => setTag(tag === t ? "" : t)}>
                {t}
              </Chip>
            ))}
          </ChipCarousel>
        )}

        {/* Empty */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl px-6 py-16 text-center"
          >
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary/60" />
            <p className="font-bengali text-lg text-muted">
              {favOnly
                ? "কোনো প্রিয় দুআ নেই।"
                : anyFilter
                ? "কোনো দুআ পাওয়া যায়নি।"
                : "এখনও কোনো দুআ যোগ করা হয়নি।"}
            </p>
          </motion.div>
        )}

        {/* List */}
        {filtered.length > 0 && (
          <>
            <p className="mb-4 font-bengali text-sm text-muted">
              মোট {filtered.length}টি দুআ
            </p>
            <motion.div layout className="space-y-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((dua, i) => (
                  <DuaCard key={dua.id} dua={dua} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </main>

      <footer className="mx-auto mt-12 max-w-4xl border-t border-border px-4 py-8">
        <p className="text-center font-bengali text-sm text-muted">
          আল্লাহ আমাদের সবাইকে সঠিক আমল করার তৌফিক দিন। আমীন।
        </p>
      </footer>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="উপরে যান"
            className="fixed bottom-6 right-6 z-30 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-fg shadow-lg glow-primary"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

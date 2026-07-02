"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { PRESET_CATEGORIES, categoryIcon } from "@/lib/categoryIcons";

const norm = (s: string) => s.trim().replace(/\s+/g, " ");
const key = (s: string) => norm(s).toLowerCase();

export default function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [all, setAll] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Merge preset suggestions with categories already used by duas (deduped).
  const merge = (apiCats: string[]) => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const c of [...PRESET_CATEGORIES, ...apiCats]) {
      const n = norm(c);
      if (!n || seen.has(key(n))) continue;
      seen.add(key(n));
      out.push(n);
    }
    return out;
  };

  useEffect(() => {
    fetch("/api/duas/categories")
      .then((r) => r.json())
      .then((d) => setAll(merge(Array.isArray(d) ? d : [])))
      .catch(() => setAll(merge([])));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const q = key(value);
  const suggestions = useMemo(
    () => all.filter((c) => key(c) !== q && (!q || key(c).includes(q))),
    [all, q]
  );
  const canCreate = q.length > 0 && !all.some((c) => key(c) === q);

  const choose = (c: string) => {
    onChange(norm(c));
    setOpen(false);
  };

  return (
    <div ref={boxRef} className="relative">
      <div className="flex items-center rounded-xl border border-border bg-surface px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="বিভাগ লিখুন বা বেছে নিন..."
          className="min-w-0 flex-1 bg-transparent py-2.5 font-bengali text-foreground outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="মুছুন"
            className="grid h-7 w-7 place-items-center rounded-full text-muted transition hover:bg-surface-2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="তালিকা"
          className="grid h-7 w-7 place-items-center rounded-full text-muted transition hover:bg-surface-2"
        >
          <ChevronDown
            className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {open && (suggestions.length > 0 || canCreate) && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg">
          {canCreate && (
            <button
              type="button"
              onClick={() => choose(value)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-bengali text-sm text-primary-strong transition hover:bg-surface-2"
            >
              <Plus className="h-4 w-4" />
              নতুন বিভাগ: <span className="font-semibold">{norm(value)}</span>
            </button>
          )}
          {suggestions.map((c) => (
            <button
              key={key(c)}
              type="button"
              onClick={() => choose(c)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-bengali text-sm text-foreground transition hover:bg-surface-2"
            >
              <span aria-hidden>{categoryIcon(c)}</span>
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

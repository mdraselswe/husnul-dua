"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="দুআ, ট্যাগ বা বিষয়বস্তু খুঁজুন..."
        className="w-full rounded-2xl border border-border bg-surface py-3.5 pl-12 pr-12 font-bengali text-base text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="মুছুন"
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-surface-2"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

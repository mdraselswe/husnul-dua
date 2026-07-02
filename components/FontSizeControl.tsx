"use client";

import { useEffect, useState } from "react";
import { AArrowDown, AArrowUp } from "lucide-react";

const KEY = "hd_read_scale";
const MIN = 0.85;
const MAX = 1.6;
const STEP = 0.15;

export default function FontSizeControl() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const v = Number(localStorage.getItem(KEY));
    if (v) setScale(v);
  }, []);

  const apply = (v: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, Number(v.toFixed(2))));
    setScale(clamped);
    document.documentElement.style.setProperty("--read-scale", String(clamped));
    try {
      localStorage.setItem(KEY, String(clamped));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex items-center gap-1 rounded-full bg-white/15 p-1">
      <button
        onClick={() => apply(scale - STEP)}
        disabled={scale <= MIN}
        aria-label="লেখা ছোট করুন"
        className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/20 active:scale-90 disabled:opacity-40"
      >
        <AArrowDown className="h-4 w-4" />
      </button>
      <button
        onClick={() => apply(scale + STEP)}
        disabled={scale >= MAX}
        aria-label="লেখা বড় করুন"
        className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/20 active:scale-90 disabled:opacity-40"
      >
        <AArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Single-line horizontal chip scroller with smooth arrows + edge fades.
export default function ChipCarousel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const nudge = (dir: number) =>
    ref.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  return (
    <div className={`relative ${className}`}>
      {/* Left arrow + fade */}
      {!atStart && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--background)] to-transparent" />
          <button
            onClick={() => nudge(-1)}
            aria-label="আগে"
            className="absolute left-0 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-surface text-foreground shadow ring-1 ring-border transition active:scale-90"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </>
      )}

      <div
        ref={ref}
        onScroll={update}
        className="no-scrollbar flex snap-x gap-2 overflow-x-auto scroll-smooth py-0.5"
      >
        {children}
      </div>

      {/* Right arrow + fade */}
      {!atEnd && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--background)] to-transparent" />
          <button
            onClick={() => nudge(1)}
            aria-label="পরে"
            className="absolute right-0 top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-surface text-foreground shadow ring-1 ring-border transition active:scale-90"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

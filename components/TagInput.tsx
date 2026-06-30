"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, X } from "lucide-react";

const norm = (s: string) => s.trim().replace(/\s+/g, " ");
const key = (s: string) => norm(s).toLowerCase();

export default function TagInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  // Selected tags derived from the comma-separated string.
  const selected = useMemo(
    () =>
      value
        .split(",")
        .map(norm)
        .filter(Boolean),
    [value]
  );

  const [all, setAll] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/duas/tags")
      .then((r) => r.json())
      .then((d) => setAll(Array.isArray(d) ? d : []))
      .catch(() => setAll([]));
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selectedKeys = useMemo(() => new Set(selected.map(key)), [selected]);

  const commit = (tags: string[]) => {
    // Dedup case-insensitively, preserve first-seen casing + order.
    const seen = new Set<string>();
    const out: string[] = [];
    for (const t of tags) {
      const n = norm(t);
      if (!n || seen.has(key(n))) continue;
      seen.add(key(n));
      out.push(n);
    }
    onChange(out.join(", "));
  };

  const addTag = (raw: string) => {
    const n = norm(raw);
    if (!n) return;
    if (!selectedKeys.has(key(n))) commit([...selected, n]);
    setInput("");
    setOpen(true);
  };

  const removeTag = (t: string) =>
    commit(selected.filter((x) => key(x) !== key(t)));

  const q = key(input);
  const suggestions = all.filter(
    (t) => !selectedKeys.has(key(t)) && (!q || key(t).includes(q))
  );
  const canCreate = q.length > 0 && !all.some((t) => key(t) === q) && !selectedKeys.has(q);

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === "Backspace" && !input && selected.length) {
      removeTag(selected[selected.length - 1]);
    }
  };

  return (
    <div ref={boxRef} className="relative">
      <div
        onClick={() => setOpen(true)}
        className="flex min-h-[46px] flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
      >
        {selected.map((t) => (
          <span
            key={key(t)}
            className="flex items-center gap-1 rounded-full bg-primary-soft py-1 pl-3 pr-1.5 font-bengali text-sm font-medium text-primary-strong"
          >
            {t}
            <button
              type="button"
              onClick={() => removeTag(t)}
              aria-label="ট্যাগ মুছুন"
              className="grid h-5 w-5 place-items-center rounded-full transition hover:bg-black/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={selected.length ? "" : "ট্যাগ লিখুন বা বেছে নিন..."}
          className="min-w-[120px] flex-1 bg-transparent py-1 font-bengali text-foreground outline-none"
        />
      </div>

      {open && (suggestions.length > 0 || canCreate) && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg">
          {canCreate && (
            <button
              type="button"
              onClick={() => addTag(input)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-bengali text-sm text-primary-strong transition hover:bg-surface-2"
            >
              <Plus className="h-4 w-4" />
              নতুন ট্যাগ: <span className="font-semibold">{norm(input)}</span>
            </button>
          )}
          {suggestions.map((t) => (
            <button
              key={key(t)}
              type="button"
              onClick={() => addTag(t)}
              className="block w-full rounded-lg px-3 py-2 text-left font-bengali text-sm text-foreground transition hover:bg-surface-2"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <p className="mt-1 font-bengali text-xs text-muted">
        Enter বা কমা চাপুন যোগ করতে। আগের ট্যাগ থেকেও বেছে নিতে পারবেন। একই ট্যাগ দুবার যোগ হবে না।
      </p>
    </div>
  );
}

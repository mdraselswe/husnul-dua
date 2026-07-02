"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Pencil, Tag, Trash2, X, Layers } from "lucide-react";
import { categoryIcon } from "@/lib/categoryIcons";

interface Item {
  name: string;
  count: number;
}
type Kind = "category" | "tag";

export default function TaxonomyManager() {
  const [cats, setCats] = useState<Item[]>([]);
  const [tags, setTags] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ kind: Kind; name: string } | null>(null);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/taxonomy")
      .then((r) => r.json())
      .then((d) => {
        setCats(d.categories || []);
        setTags(d.tags || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const startEdit = (kind: Kind, name: string) => {
    setEditing({ kind, name });
    setValue(name);
  };

  const save = async () => {
    if (!editing) return;
    const to = value.trim();
    if (!to || to === editing.name) {
      setEditing(null);
      return;
    }
    setBusy(true);
    await fetch("/api/admin/taxonomy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: editing.kind, from: editing.name, to }),
    });
    setBusy(false);
    setEditing(null);
    load();
  };

  const remove = async (kind: Kind, name: string) => {
    if (!confirm(`"${name}" ${kind === "tag" ? "ট্যাগ" : "বিভাগ"} সব দুআ থেকে সরাবেন?`))
      return;
    setBusy(true);
    await fetch("/api/admin/taxonomy", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, from: name, to: "" }),
    });
    setBusy(false);
    load();
  };

  const Row = ({ kind, item }: { kind: Kind; item: Item }) => {
    const isEditing = editing?.kind === kind && editing.name === item.name;
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
        {isEditing ? (
          <>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") setEditing(null);
              }}
              className="min-w-0 flex-1 rounded-lg border border-primary bg-background px-2 py-1 font-bengali text-foreground outline-none"
            />
            <button
              onClick={save}
              disabled={busy}
              aria-label="সংরক্ষণ"
              className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-fg disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setEditing(null)}
              aria-label="বাতিল"
              className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-2"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <span className="flex min-w-0 flex-1 items-center gap-2 font-bengali text-foreground">
              {kind === "category" && <span aria-hidden>{categoryIcon(item.name)}</span>}
              <span className="truncate">{item.name}</span>
              <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
                {item.count}
              </span>
            </span>
            <button
              onClick={() => startEdit(kind, item.name)}
              aria-label="নাম পরিবর্তন"
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-surface-2"
            >
              <Pencil className="h-[15px] w-[15px]" />
            </button>
            <button
              onClick={() => remove(kind, item.name)}
              aria-label="সরান"
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
            >
              <Trash2 className="h-[15px] w-[15px]" />
            </button>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 flex items-center gap-2 font-bengali text-lg font-bold text-foreground">
          <Layers className="h-5 w-5 text-primary" />
          বিভাগ ({cats.length})
        </h2>
        {cats.length === 0 ? (
          <p className="font-bengali text-sm text-muted">কোনো বিভাগ নেই।</p>
        ) : (
          <div className="space-y-2">
            {cats.map((c) => (
              <Row key={c.name} kind="category" item={c} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 font-bengali text-lg font-bold text-foreground">
          <Tag className="h-5 w-5 text-primary" />
          ট্যাগ ({tags.length})
        </h2>
        {tags.length === 0 ? (
          <p className="font-bengali text-sm text-muted">কোনো ট্যাগ নেই।</p>
        ) : (
          <div className="space-y-2">
            {tags.map((t) => (
              <Row key={t.name} kind="tag" item={t} />
            ))}
          </div>
        )}
      </section>

      <p className="font-bengali text-xs text-muted">
        নাম পরিবর্তন করলে সব দুআয় একসাথে আপডেট হবে। সরালে সব দুআ থেকে মুছে যাবে।
        একই নামে rename করলে দুটি একত্র (merge) হবে।
      </p>
    </div>
  );
}

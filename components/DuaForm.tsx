"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";
import type { DuaFormData, DuaSegment } from "@/lib/types";
import TagInput from "./TagInput";
import CategorySelect from "./CategorySelect";
import { useAdmin } from "./AdminProvider";
import { addMyDua } from "./myDuas";

const EMPTY: DuaFormData = {
  titleBengali: "",
  titleEnglish: "",
  arabic: "",
  transliteration: "",
  bengali: "",
  english: "",
  tags: "",
  category: "",
  source: "",
  times: "",
  benefits: "",
  fojilot: "",
  rules: "",
  context: "",
  quranRef: "",
  videoUrl: "",
  articleUrl: "",
  segments: [],
};

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block font-bengali text-sm font-semibold text-foreground">
      {children}
    </label>
  );
}

export default function DuaForm({
  initial,
  duaId,
  editToken,
}: {
  initial?: DuaFormData;
  duaId?: string;
  editToken?: string;
}) {
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<DuaFormData>(() => {
    const merged = { ...EMPTY, ...(initial ?? {}) };
    // API returns null for empty optional columns; controlled inputs need "".
    (Object.keys(EMPTY) as (keyof DuaFormData)[]).forEach((k) => {
      if (k !== "segments" && merged[k] == null) (merged as Record<string, unknown>)[k] = "";
    });
    merged.segments = Array.isArray(merged.segments) ? merged.segments : [];
    return merged;
  });

  const isEdit = !!duaId;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const segments = form.segments ?? [];
  const setSegments = (next: DuaSegment[]) =>
    setForm((f) => ({ ...f, segments: next }));
  const addSegment = () =>
    setSegments([...segments, { arabic: "", transliteration: "", bengali: "" }]);
  const updateSegment = (i: number, field: keyof DuaSegment, val: string) =>
    setSegments(segments.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  const removeSegment = (i: number) =>
    setSegments(segments.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleBengali || !form.bengali || !form.tags) {
      setError("আবশ্যকীয় ক্ষেত্রগুলো পূরণ করুন (শিরোনাম, বাংলা অনুবাদ, ট্যাগ)।");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        isEdit ? `/api/duas/${duaId}` : "/api/duas",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editToken ? { ...form, editToken } : form),
        }
      );
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        // New public submission → save ownership locally + thank-you screen.
        if (!isEdit && data.pending) {
          if (data.id && data.editToken) {
            addMyDua({
              id: data.id,
              editToken: data.editToken,
              title: form.titleBengali || "দুআ",
              at: Date.now(),
            });
          }
          setSubmitted(true);
          return;
        }
        // Owner editing their own pending dua → back to "my duas".
        if (isEdit && editToken && !isAdmin) {
          router.push("/my");
          router.refresh();
          return;
        }
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "সংরক্ষণে সমস্যা হয়েছে।");
      }
    } catch {
      setError("নেটওয়ার্ক সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="animate-fade-up rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-primary" />
        <h2 className="mb-2 font-bengali text-xl font-bold text-foreground">
          জমা দেওয়ার জন্য জাযাকাল্লাহু খাইরান!
        </h2>
        <p className="mx-auto mb-6 max-w-md font-bengali text-muted">
          আপনার দুআটি পর্যালোচনার জন্য পাঠানো হয়েছে। অ্যাডমিন অনুমোদন করলে এটি
          তালিকায় দেখা যাবে। ততক্ষণ &ldquo;আমার দুআ&rdquo; থেকে দেখতে ও সম্পাদনা
          করতে পারবেন।
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              setForm(EMPTY);
              setSubmitted(false);
            }}
            className="rounded-xl bg-surface-2 px-5 py-2.5 font-bengali font-semibold text-foreground transition hover:opacity-80"
          >
            আরেকটি যোগ করুন
          </button>
          <button
            onClick={() => router.push("/my")}
            className="rounded-xl bg-primary px-5 py-2.5 font-bengali font-semibold text-primary-fg transition hover:bg-primary-strong"
          >
            আমার দুআ দেখুন
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-surface-2 px-5 py-2.5 font-bengali font-semibold text-foreground transition hover:opacity-80"
          >
            হোমে
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isEdit && !isAdmin && (
        <div className="animate-fade-up rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 font-bengali text-sm text-foreground">
          আপনার জমা দেওয়া দুআ অ্যাডমিন পর্যালোচনা ও অনুমোদনের পর তালিকায় যুক্ত হবে।
        </div>
      )}
      {error && (
        <div className="animate-fade-up rounded-xl border border-red-300 bg-red-50 px-4 py-3 font-bengali text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 font-bengali text-lg font-bold text-foreground">
          মূল তথ্য
        </h2>
        <div className="space-y-4">
          <div>
            <Label>
              শিরোনাম (বাংলা) <span className="text-red-500">*</span>
            </Label>
            <input
              name="titleBengali"
              value={form.titleBengali}
              onChange={handleChange}
              required
              className={`${fieldClass} font-bengali`}
              placeholder="যেমন: মাথা ব্যথার দোয়া"
            />
          </div>
          <div>
            <Label>শিরোনাম (ইংরেজি) — ঐচ্ছিক</Label>
            <input
              name="titleEnglish"
              value={form.titleEnglish}
              onChange={handleChange}
              className={fieldClass}
              placeholder="e.g., Dua for Headache"
            />
          </div>
          <div>
            <Label>আরবি — ঐচ্ছিক</Label>
            <textarea
              name="arabic"
              value={form.arabic}
              onChange={handleChange}
              rows={3}
              className={`${fieldClass} font-arabic text-xl`}
              placeholder="আরবি পাঠ এখানে লিখুন"
            />
          </div>
          <div>
            <Label>উচ্চারণ — ঐচ্ছিক</Label>
            <textarea
              name="transliteration"
              value={form.transliteration}
              onChange={handleChange}
              rows={2}
              className={`${fieldClass} italic`}
              placeholder="Transliteration in English"
            />
          </div>
          <div>
            <Label>
              বাংলা অনুবাদ <span className="text-red-500">*</span>
            </Label>
            <textarea
              name="bengali"
              value={form.bengali}
              onChange={handleChange}
              required
              rows={3}
              className={`${fieldClass} font-bengali`}
              placeholder="বাংলা অনুবাদ এখানে লিখুন"
            />
          </div>
          <div>
            <Label>ইংরেজি অনুবাদ — ঐচ্ছিক</Label>
            <textarea
              name="english"
              value={form.english}
              onChange={handleChange}
              rows={2}
              className={fieldClass}
              placeholder="English translation (optional)"
            />
          </div>
          <div>
            <Label>
              ট্যাগ <span className="text-red-500">*</span>
            </Label>
            <TagInput
              value={form.tags}
              onChange={(tags) => setForm((f) => ({ ...f, tags }))}
            />
          </div>
        </div>
      </section>

      {/* Extra duas — for an amol with multiple duas */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h2 className="font-bengali text-lg font-bold text-foreground">
            অতিরিক্ত দুআ
          </h2>
          <span className="font-bengali text-xs text-muted">
            আমলে একাধিক দুআ থাকলে
          </span>
        </div>
        <p className="mb-4 font-bengali text-xs text-muted">
          উপরের দুআটি #১। এখানে যোগ করলে একই কার্ডে #২, #৩ ... হিসেবে দেখাবে।
        </p>

        <div className="space-y-4">
          {segments.map((seg, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-surface-2/40 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-bengali text-sm font-semibold text-primary-strong">
                  দুআ #{i + 2}
                </span>
                <button
                  type="button"
                  onClick={() => removeSegment(i)}
                  aria-label="মুছুন"
                  className="flex items-center gap-1 rounded-lg px-2 py-1 font-bengali text-xs text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-4 w-4" />
                  সরান
                </button>
              </div>
              <div className="space-y-3">
                <textarea
                  value={seg.arabic ?? ""}
                  onChange={(e) => updateSegment(i, "arabic", e.target.value)}
                  rows={2}
                  className={`${fieldClass} font-arabic text-xl`}
                  placeholder="আরবি"
                />
                <textarea
                  value={seg.transliteration ?? ""}
                  onChange={(e) =>
                    updateSegment(i, "transliteration", e.target.value)
                  }
                  rows={2}
                  className={`${fieldClass} italic`}
                  placeholder="উচ্চারণ"
                />
                <textarea
                  value={seg.bengali ?? ""}
                  onChange={(e) => updateSegment(i, "bengali", e.target.value)}
                  rows={2}
                  className={`${fieldClass} font-bengali`}
                  placeholder="বাংলা অনুবাদ"
                />
                <input
                  value={seg.source ?? ""}
                  onChange={(e) => updateSegment(i, "source", e.target.value)}
                  className={`${fieldClass} font-bengali`}
                  placeholder="উৎস (ঐচ্ছিক)"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSegment}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/50 py-3 font-bengali font-semibold text-primary-strong transition hover:bg-primary-soft/40"
          >
            <Plus className="h-5 w-5" />
            আরও দুআ যোগ করুন
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 font-bengali text-lg font-bold text-foreground">
          অতিরিক্ত তথ্য (ঐচ্ছিক)
        </h2>
        <div className="space-y-4">
          <div>
            <Label>বিষয়/বিভাগ</Label>
            <CategorySelect
              value={form.category ?? ""}
              onChange={(category) => setForm((f) => ({ ...f, category }))}
            />
          </div>
          <div>
            <Label>প্রেক্ষাপট</Label>
            <textarea
              name="context"
              value={form.context}
              onChange={handleChange}
              rows={3}
              className={`${fieldClass} font-bengali`}
              placeholder="দুআটির প্রেক্ষাপট/পটভূমি — কখন, কেন, কোন ঘটনায়"
            />
          </div>
          <div>
            <Label>উৎস</Label>
            <input
              name="source"
              value={form.source}
              onChange={handleChange}
              className={`${fieldClass} font-bengali`}
              placeholder="যেমন: সহীহ বুখারী, সহীহ মুসলিম"
            />
          </div>
          <div>
            <Label>পড়ার সময়/সংখ্যা</Label>
            <input
              name="times"
              value={form.times}
              onChange={handleChange}
              className={`${fieldClass} font-bengali`}
              placeholder="যেমন: ৩ বার, ফজরের পর"
            />
          </div>
          <div>
            <Label>পড়ার নিয়ম</Label>
            <textarea
              name="rules"
              value={form.rules}
              onChange={handleChange}
              rows={3}
              className={`${fieldClass} font-bengali`}
              placeholder="কীভাবে ও কখন পড়তে হয় বিস্তারিত লিখুন"
            />
          </div>
          <div>
            <Label>ফায়েদা</Label>
            <textarea
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              rows={3}
              className={`${fieldClass} font-bengali`}
              placeholder="এই দুআ পড়ার ফায়েদা সম্পর্কে লিখুন"
            />
          </div>
          <div>
            <Label>ফজিলত</Label>
            <textarea
              name="fojilot"
              value={form.fojilot}
              onChange={handleChange}
              rows={3}
              className={`${fieldClass} font-bengali`}
              placeholder="এই আমলের ফজিলত/মর্যাদা সম্পর্কে লিখুন"
            />
          </div>
          <div>
            <Label>কুরআন তিলাওয়াত রেফারেন্স — ঐচ্ছিক</Label>
            <input
              name="quranRef"
              value={form.quranRef}
              onChange={handleChange}
              className={fieldClass}
              placeholder="যেমন: 2:255  বা  112:1-4, 113:1-5"
            />
            <p className="mt-1 font-bengali text-xs text-muted">
              সূরা:আয়াত (কুরআনের আয়াত হলে)। একাধিক হলে কমা দিন। সহীহ তিলাওয়াত
              (মিশারি আল-আফাসি) কার্ডে বাজবে। হাদিসের দুআয় খালি রাখুন।
            </p>
          </div>
          <div>
            <Label>ভিডিও লিংক — ঐচ্ছিক</Label>
            <input
              type="url"
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              className={fieldClass}
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <Label>আর্টিকেল লিংক — ঐচ্ছিক</Label>
            <input
              type="url"
              name="articleUrl"
              value={form.articleUrl}
              onChange={handleChange}
              className={fieldClass}
              placeholder="https://..."
            />
          </div>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl bg-surface-2 px-6 py-3 font-bengali font-semibold text-foreground transition hover:opacity-80"
        >
          বাতিল
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bengali font-semibold text-primary-fg shadow-md transition hover:bg-primary-strong disabled:opacity-60 sm:flex-none"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {loading
            ? "অপেক্ষা করুন..."
            : isEdit
            ? "আপডেট করুন"
            : isAdmin
            ? "সংরক্ষণ করুন"
            : "জমা দিন"}
        </button>
      </div>
    </form>
  );
}

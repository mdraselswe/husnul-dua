"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import type { DuaFormData } from "@/lib/types";
import TagInput from "./TagInput";
import CategorySelect from "./CategorySelect";
import { useAdmin } from "./AdminProvider";

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
}: {
  initial?: DuaFormData;
  duaId?: string;
}) {
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<DuaFormData>({ ...EMPTY, ...initial });

  const isEdit = !!duaId;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

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
          body: JSON.stringify(form),
        }
      );
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        // Admin edits/creates land in the list immediately → go home.
        // Public submissions are pending review → show a thank-you screen.
        if (isEdit || isAdmin || !data.pending) {
          router.push("/");
          router.refresh();
        } else {
          setSubmitted(true);
        }
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
          তালিকায় দেখা যাবে।
        </p>
        <div className="flex justify-center gap-3">
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
            onClick={() => router.push("/")}
            className="rounded-xl bg-primary px-5 py-2.5 font-bengali font-semibold text-primary-fg transition hover:bg-primary-strong"
          >
            হোমে ফিরুন
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

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useAdmin } from "@/components/AdminProvider";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const next = params.get("next") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        refresh();
        router.replace(next);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "লগইন ব্যর্থ হয়েছে।");
      }
    } catch {
      setError("নেটওয়ার্ক সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-7 shadow-lg">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary-strong">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <h1 className="font-bengali text-xl font-bold text-foreground">
          অ্যাডমিন লগইন
        </h1>
        <p className="mt-1 font-bengali text-sm text-muted">
          দুআ যোগ, সম্পাদনা ও মুছতে লগইন করুন।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            placeholder="পাসওয়ার্ড"
            className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 font-bengali text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {error && (
          <p className="animate-fade-up font-bengali text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bengali font-semibold text-primary-fg shadow-md transition hover:bg-primary-strong disabled:opacity-60"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {loading ? "যাচাই হচ্ছে..." : "লগইন"}
        </button>
      </form>

      <button
        onClick={() => router.push("/")}
        className="mt-5 flex w-full items-center justify-center gap-1.5 font-bengali text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        হোমে ফিরুন
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

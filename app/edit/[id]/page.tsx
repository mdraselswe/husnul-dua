"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import DuaForm from "@/components/DuaForm";
import { tokenFor } from "@/components/myDuas";
import type { DuaFormData } from "@/lib/types";

export default function EditDuaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<DuaFormData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setToken(tokenFor(id));
    fetch(`/api/duas/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setData(d))
      .catch(() => setNotFound(true));
  }, [id]);

  return (
    <div className="min-h-screen">
      <header className="bg-mesh relative overflow-hidden text-white shadow-lg">
        <div className="mx-auto max-w-4xl px-4 py-5">
          <button
            onClick={() => router.back()}
            className="mb-3 flex items-center gap-2 font-bengali text-sm text-white/90 transition hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            ফিরে যান
          </button>
          <h1 className="font-bengali text-2xl font-bold">দুআ সম্পাদনা করুন</h1>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        {notFound ? (
          <p className="rounded-2xl border border-border bg-surface px-6 py-12 text-center font-bengali text-muted">
            দুআ পাওয়া যায়নি।
          </p>
        ) : !data ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DuaForm initial={data} duaId={id} editToken={token} />
        )}
      </main>
    </div>
  );
}

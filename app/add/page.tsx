"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import DuaForm from "@/components/DuaForm";

export default function AddDuaPage() {
  const router = useRouter();
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
          <h1 className="font-bengali text-2xl font-bold">নতুন দুআ যোগ করুন</h1>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <DuaForm />
      </main>
    </div>
  );
}

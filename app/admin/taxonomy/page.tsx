import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TaxonomyManager from "@/components/TaxonomyManager";

export const metadata = { title: "বিভাগ ও ট্যাগ" };

export default function TaxonomyPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-mesh relative overflow-hidden text-white shadow-lg">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <Link
            href="/admin"
            className="mb-3 flex items-center gap-2 font-bengali text-sm text-white/90 transition hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            ড্যাশবোর্ড
          </Link>
          <h1 className="font-bengali text-2xl font-bold">বিভাগ ও ট্যাগ ব্যবস্থাপনা</h1>
          <p className="font-bengali text-sm text-white/80">
            নাম পরিবর্তন বা মুছে ফেলুন — সব দুআয় প্রয়োগ হবে।
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <TaxonomyManager />
      </main>
    </div>
  );
}

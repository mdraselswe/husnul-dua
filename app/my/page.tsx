import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MySubmissions from "@/components/MySubmissions";

export const metadata = { title: "আমার দুআ" };

export default function MyDuasPage() {
  return (
    <div className="min-h-screen">
      <header className="bg-mesh relative overflow-hidden text-white shadow-lg">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <Link
            href="/"
            className="mb-3 flex items-center gap-2 font-bengali text-sm text-white/90 transition hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            হোমে ফিরুন
          </Link>
          <h1 className="font-bengali text-2xl font-bold">আমার জমা দেওয়া দুআ</h1>
          <p className="font-bengali text-sm text-white/80">
            পর্যালোচনার অবস্থা দেখুন; অপেক্ষমাণ থাকলে সম্পাদনা করুন।
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <MySubmissions />
      </main>
    </div>
  );
}

"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 font-bengali text-sm font-semibold text-white transition hover:bg-white/25 print:hidden"
    >
      <Printer className="h-4 w-4" />
      প্রিন্ট
    </button>
  );
}

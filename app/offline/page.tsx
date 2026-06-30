import { WifiOff } from "lucide-react";

export const metadata = { title: "অফলাইন" };

export default function OfflinePage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="glass max-w-sm rounded-3xl p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary-strong">
          <WifiOff className="h-8 w-8" />
        </span>
        <h1 className="mb-2 font-bengali text-xl font-bold text-foreground">
          আপনি অফলাইন
        </h1>
        <p className="font-bengali text-muted">
          ইন্টারনেট সংযোগ নেই। আগে দেখা দুআগুলো সংরক্ষিত থাকতে পারে — সংযোগ ফিরে
          এলে আবার চেষ্টা করুন।
        </p>
      </div>
    </div>
  );
}

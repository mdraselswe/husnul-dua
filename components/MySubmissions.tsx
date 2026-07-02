"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2, Pencil, XCircle } from "lucide-react";
import { getMyDuas, type MyDua } from "./myDuas";

interface Row extends MyDua {
  status?: string;
  rejectReason?: string;
  gone?: boolean;
}

const STATUS: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  pending: {
    label: "পর্যালোচনায়",
    cls: "bg-accent-soft text-accent",
    icon: <Clock className="h-4 w-4" />,
  },
  approved: {
    label: "অনুমোদিত",
    cls: "bg-primary-soft text-primary-strong",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  rejected: {
    label: "বাতিল",
    cls: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
    icon: <XCircle className="h-4 w-4" />,
  },
};

export default function MySubmissions() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mine = getMyDuas();
    if (mine.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(
      mine.map(async (m) => {
        try {
          const res = await fetch(`/api/duas/${m.id}`);
          if (res.status === 404) return { ...m, gone: true };
          const d = await res.json();
          return { ...m, status: d.status, rejectReason: d.rejectReason };
        } catch {
          return { ...m };
        }
      })
    ).then((r) => {
      setRows(r);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="glass rounded-3xl px-6 py-16 text-center">
        <p className="mb-4 font-bengali text-lg text-muted">
          আপনি এখনো কোনো দুআ জমা দেননি।
        </p>
        <Link
          href="/add"
          className="inline-block rounded-xl bg-primary px-5 py-2.5 font-bengali font-semibold text-primary-fg"
        >
          দুআ যোগ করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const st = STATUS[r.status || "pending"];
        return (
          <div key={r.id} className="glass rounded-2xl px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bengali text-lg font-bold text-foreground">
                  {r.title}
                </h3>
                {r.gone ? (
                  <span className="font-bengali text-sm text-muted">
                    মুছে ফেলা হয়েছে
                  </span>
                ) : (
                  <span
                    className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-bengali text-xs font-medium ${st.cls}`}
                  >
                    {st.icon}
                    {st.label}
                  </span>
                )}
                {r.status === "rejected" && r.rejectReason && (
                  <p className="mt-1.5 font-bengali text-sm text-muted">
                    কারণ: {r.rejectReason}
                  </p>
                )}
              </div>

              {!r.gone && r.status === "approved" && (
                <Link
                  href={`/dua/${r.id}`}
                  className="shrink-0 rounded-lg bg-surface-2 px-3 py-1.5 font-bengali text-sm font-semibold text-foreground"
                >
                  দেখুন
                </Link>
              )}
              {!r.gone && r.status === "pending" && (
                <Link
                  href={`/edit/${r.id}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-bengali text-sm font-semibold text-primary-fg"
                >
                  <Pencil className="h-4 w-4" />
                  সম্পাদনা
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Loader2 } from "lucide-react";

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (s: string | number) =>
  String(s).replace(/\d/g, (d) => BN[Number(d)]);

const NAMES: Record<string, string> = {
  Fajr: "ফজর",
  Sunrise: "সূর্যোদয়",
  Dhuhr: "যোহর",
  Asr: "আসর",
  Maghrib: "মাগরিব",
  Isha: "ইশা",
};
const ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${toBn(h12)}:${toBn(String(m).padStart(2, "0"))} ${ampm}`;
}

export default function PrayerTimes() {
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [asked, setAsked] = useState(false);

  const load = (lat: number, lng: number) => {
    setLoading(true);
    setError("");
    fetch(
      `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`
    )
      .then((r) => r.json())
      .then((d) => {
        setTimings(d?.data?.timings ?? null);
        try {
          localStorage.setItem("hd_geo", JSON.stringify({ lat, lng }));
        } catch {
          /* ignore */
        }
      })
      .catch(() => setError("সময় আনতে সমস্যা হয়েছে।"))
      .finally(() => setLoading(false));
  };

  const requestLocation = () => {
    setAsked(true);
    if (!navigator.geolocation) {
      setError("এই ডিভাইসে লোকেশন সমর্থিত নয়।");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => load(pos.coords.latitude, pos.coords.longitude),
      () => {
        setLoading(false);
        setError("লোকেশন অনুমতি দিন।");
      },
      { timeout: 10000 }
    );
  };

  // Auto-load if we already have a saved location.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hd_geo");
      if (saved) {
        const { lat, lng } = JSON.parse(saved);
        setAsked(true);
        load(lat, lng);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine the next upcoming prayer.
  let nextKey = "";
  if (timings) {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    for (const k of ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]) {
      const [h, m] = (timings[k] || "0:0").split(":").map(Number);
      if (h * 60 + m >= mins) {
        nextKey = k;
        break;
      }
    }
    if (!nextKey) nextKey = "Fajr";
  }

  if (!asked && !timings) {
    return (
      <button
        onClick={requestLocation}
        className="glass flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bengali text-sm font-semibold text-foreground transition hover:shadow-md"
      >
        <MapPin className="h-4 w-4 text-primary" />
        নামাজের সময় দেখুন
      </button>
    );
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <span className="font-bengali text-sm font-semibold text-foreground">
          আজকের নামাজের সময়
        </span>
        {loading && <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted" />}
      </div>

      {error && (
        <p className="font-bengali text-sm text-muted">
          {error}{" "}
          <button onClick={requestLocation} className="text-primary underline">
            আবার
          </button>
        </p>
      )}

      {timings && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ORDER.map((k) => (
            <div
              key={k}
              className={`rounded-xl px-2 py-2 text-center transition ${
                k === nextKey
                  ? "bg-primary text-primary-fg shadow"
                  : "bg-surface-2/60 text-foreground"
              }`}
            >
              <p className="font-bengali text-xs opacity-80">{NAMES[k]}</p>
              <p className="font-bengali text-sm font-semibold tabular-nums">
                {to12h(timings[k])}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

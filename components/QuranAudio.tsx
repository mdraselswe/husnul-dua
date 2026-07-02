"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play, Square } from "lucide-react";
import { parseQuranRef } from "@/lib/quran";

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number) => String(n).replace(/\d/g, (d) => BN[Number(d)]);

export default function QuranAudio({ quranRef }: { quranRef?: string }) {
  const ayahs = parseQuranRef(quranRef);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  // When index changes while playing, load + play the next ayah.
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !playing) return;
    a.src = ayahs[index].url;
    setLoading(true);
    a.play().catch(() => {
      setPlaying(false);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing]);

  if (ayahs.length === 0) return null;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      if (index >= ayahs.length) setIndex(0);
      setPlaying(true);
    }
  };

  const stop = () => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setPlaying(false);
    setIndex(0);
  };

  const onEnded = () => {
    if (index + 1 < ayahs.length) {
      setIndex((i) => i + 1);
    } else {
      setPlaying(false);
      setIndex(0);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary-soft/40 px-4 py-2.5">
      <audio
        ref={audioRef}
        onPlaying={() => setLoading(false)}
        onWaiting={() => setLoading(true)}
        onEnded={onEnded}
        preload="none"
      />
      <button
        onClick={toggle}
        aria-label={playing ? "থামান" : "তিলাওয়াত শুনুন"}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-fg shadow transition active:scale-90"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : playing ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 translate-x-[1px]" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className="font-bengali text-sm font-semibold text-foreground">
          তিলাওয়াত শুনুন
        </p>
        <p className="font-bengali text-xs text-muted">
          মিশারি আল-আফাসি
          {ayahs.length > 1 &&
            ` · আয়াত ${toBn(Math.min(index + 1, ayahs.length))}/${toBn(ayahs.length)}`}
        </p>
      </div>
      {playing && (
        <button
          onClick={stop}
          aria-label="বন্ধ"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface-2 active:scale-90"
        >
          <Square className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

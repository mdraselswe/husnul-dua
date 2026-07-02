"use client";

import { useEffect, useState } from "react";

const KEY = "hd_visit_days";

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const dayNumber = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
};

// Consecutive-day visit streak, stored in localStorage. Records today on mount.
export function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let days: string[] = [];
    try {
      days = JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      days = [];
    }
    const today = todayStr();
    if (!days.includes(today)) {
      days.push(today);
      try {
        localStorage.setItem(KEY, JSON.stringify(days.slice(-400)));
      } catch {
        /* ignore */
      }
    }
    // Count back consecutive days ending today.
    const set = new Set(days.map(dayNumber));
    let n = 0;
    let cur = dayNumber(today);
    while (set.has(cur)) {
      n++;
      cur--;
    }
    setStreak(n);
  }, []);

  return streak;
}

"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("hd_theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="থিম পরিবর্তন"
      className="relative grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25 active:scale-90"
    >
      {mounted && dark ? (
        <Sun className="h-5 w-5 animate-fade-in" />
      ) : (
        <Moon className="h-5 w-5 animate-fade-in" />
      )}
    </button>
  );
}

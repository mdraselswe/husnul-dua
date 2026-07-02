// Build free Quran recitation audio URLs (Mishary Alafasy, everyayah.com).
// No API key. Ref format: "2:255" or ranges/lists "112:1-4, 113:1-5".

const RECITER = "Alafasy_128kbps";
const pad3 = (n: number) => String(n).padStart(3, "0");

export interface QuranAyah {
  surah: number;
  ayah: number;
  url: string;
}

export function ayahAudioUrl(surah: number, ayah: number): string {
  return `https://everyayah.com/data/${RECITER}/${pad3(surah)}${pad3(ayah)}.mp3`;
}

export function parseQuranRef(ref?: string | null): QuranAyah[] {
  if (!ref) return [];
  const out: QuranAyah[] = [];
  for (const part of ref.split(",")) {
    const m = part.trim().match(/^(\d{1,3}):(\d{1,3})(?:\s*-\s*(\d{1,3}))?$/);
    if (!m) continue;
    const surah = Number(m[1]);
    const start = Number(m[2]);
    const end = m[3] ? Number(m[3]) : start;
    if (surah < 1 || surah > 114 || start < 1 || end < start || end - start > 300)
      continue;
    for (let a = start; a <= end; a++) out.push({ surah, ayah: a, url: ayahAudioUrl(surah, a) });
  }
  return out;
}

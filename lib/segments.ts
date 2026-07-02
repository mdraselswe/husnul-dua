// Keep only non-empty extra-dua blocks; strip undefined keys for clean JSON.
// Returns an array (possibly empty) suitable for a Prisma Json column.
export function cleanSegments(segments: unknown): Record<string, string>[] {
  if (!Array.isArray(segments)) return [];
  return segments
    .map((s) => {
      const o: Record<string, string> = {};
      for (const k of ["arabic", "transliteration", "bengali", "source"]) {
        const v = s?.[k];
        if (typeof v === "string" && v.trim()) o[k] = v.trim();
      }
      return o;
    })
    .filter((o) => o.arabic || o.transliteration || o.bengali);
}

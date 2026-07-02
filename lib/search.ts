// Normalize text for search: lowercase, strip Arabic harakat, zero-width chars,
// and punctuation, collapse whitespace. Bengali is caseless so unaffected.
export function normalize(s?: string | null): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[ً-ٰٟ]/g, "") // Arabic diacritics
    .replace(/[​-‍﻿]/g, "") // zero-width
    .replace(/[.,;:!?()[\]'"“”‘’\-–—/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Every whitespace-separated query token must appear in the haystack.
export function matchesQuery(haystack: string, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  const hay = normalize(haystack);
  return q.split(" ").every((tok) => hay.includes(tok));
}

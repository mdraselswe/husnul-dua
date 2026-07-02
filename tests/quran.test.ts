import { describe, it, expect } from "vitest";
import { parseQuranRef, ayahAudioUrl } from "@/lib/quran";

describe("parseQuranRef", () => {
  it("parses a single ayah", () => {
    const r = parseQuranRef("2:255");
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ surah: 2, ayah: 255 });
    expect(r[0].url).toContain("002255.mp3");
  });

  it("parses a range", () => {
    const r = parseQuranRef("112:1-4");
    expect(r.map((x) => x.ayah)).toEqual([1, 2, 3, 4]);
  });

  it("parses a comma list", () => {
    const r = parseQuranRef("112:1-2, 113:1");
    expect(r).toHaveLength(3);
    expect(r[2]).toMatchObject({ surah: 113, ayah: 1 });
  });

  it("ignores invalid parts and empty input", () => {
    expect(parseQuranRef("")).toEqual([]);
    expect(parseQuranRef("hadith")).toEqual([]);
    expect(parseQuranRef("999:1")).toEqual([]); // surah out of range
  });

  it("builds zero-padded urls", () => {
    expect(ayahAudioUrl(1, 1)).toContain("001001.mp3");
  });
});

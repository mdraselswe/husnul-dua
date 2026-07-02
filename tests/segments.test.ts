import { describe, it, expect } from "vitest";
import { cleanSegments } from "@/lib/segments";

describe("cleanSegments", () => {
  it("returns [] for non-arrays", () => {
    expect(cleanSegments(undefined)).toEqual([]);
    expect(cleanSegments(null)).toEqual([]);
    expect(cleanSegments("x")).toEqual([]);
  });

  it("drops empty blocks and trims values", () => {
    const out = cleanSegments([
      { arabic: "  ", transliteration: "", bengali: "" },
      { bengali: "  আল্লাহ  ", source: " বুখারি " },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]).toEqual({ bengali: "আল্লাহ", source: "বুখারি" });
  });

  it("strips unknown keys", () => {
    const out = cleanSegments([{ bengali: "x", hacker: "y" }]);
    expect(out[0]).not.toHaveProperty("hacker");
  });
});

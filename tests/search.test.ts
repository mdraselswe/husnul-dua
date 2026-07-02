import { describe, it, expect } from "vitest";
import { normalize, matchesQuery } from "@/lib/search";

describe("normalize", () => {
  it("lowercases and collapses whitespace/punctuation", () => {
    expect(normalize("  Hello,   World! ")).toBe("hello world");
  });
});

describe("matchesQuery", () => {
  it("matches Bengali prefix via substring", () => {
    expect(matchesQuery("সকালের দোয়া", "সকাল")).toBe(true);
  });
  it("requires every token", () => {
    expect(matchesQuery("সকাল সন্ধ্যা দোয়া", "সকাল দোয়া")).toBe(true);
    expect(matchesQuery("সকালের দোয়া", "সকাল রাত")).toBe(false);
  });
  it("empty query matches all", () => {
    expect(matchesQuery("anything", "")).toBe(true);
  });
});

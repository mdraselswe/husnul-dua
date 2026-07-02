import { describe, it, expect } from "vitest";
import { categoryIcon } from "@/lib/categoryIcons";

describe("categoryIcon", () => {
  it("maps known categories", () => {
    expect(categoryIcon("স্বাস্থ্য")).toBe("🩺");
    expect(categoryIcon("সুরক্ষা")).toBe("🛡️");
    expect(categoryIcon("সকাল")).toBe("🌅");
  });
  it("falls back to default", () => {
    expect(categoryIcon("অজানা")).toBe("📿");
    expect(categoryIcon(undefined)).toBe("📿");
  });
});

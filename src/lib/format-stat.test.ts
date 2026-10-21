import { describe, expect, it } from "vitest";

import { formatStat } from "./format-stat";

describe("formatStat", () => {
  it("adds prefix, suffix and thousands separators", () => {
    expect(formatStat({ value: 327, prefix: "+", suffix: "%" })).toBe("+327%");
    expect(formatStat({ value: 1284 })).toBe("1,284");
  });

  it("keeps fixed decimals while counting", () => {
    expect(formatStat({ value: 4.9, decimals: 1 })).toBe("4.9");
    expect(formatStat({ value: 2.4567, decimals: 1 })).toBe("2.5");
    expect(formatStat({ value: 0, decimals: 1 })).toBe("0.0");
  });

  it("rounds mid-animation values to whole numbers by default", () => {
    expect(formatStat({ value: 163.6, prefix: "#" })).toBe("#164");
  });
});

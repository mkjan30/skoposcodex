import { describe, expect, it } from "vitest";

import { formatUsPhone, normalizeUsPhone } from "./phone";

describe("formatUsPhone", () => {
  it("formats progressively while typing", () => {
    expect(formatUsPhone("")).toBe("");
    expect(formatUsPhone("9")).toBe("(9");
    expect(formatUsPhone("941")).toBe("(941");
    expect(formatUsPhone("9413")).toBe("(941) 3");
    expect(formatUsPhone("941374")).toBe("(941) 374");
    expect(formatUsPhone("9413748")).toBe("(941) 374-8");
    expect(formatUsPhone("9413748014")).toBe("(941) 374-8014");
  });

  it("handles pasted numbers, country code and extra digits", () => {
    expect(formatUsPhone("941-374-8014")).toBe("(941) 374-8014");
    expect(formatUsPhone("+1 (941) 374 8014")).toBe("(941) 374-8014");
    expect(formatUsPhone("19413748014")).toBe("(941) 374-8014");
    expect(formatUsPhone("94137480149999")).toBe("(941) 374-8014");
  });

  it("drops the +1 country code while it is being typed", () => {
    let value = "";
    for (const key of "+1 941 374 8014") value = formatUsPhone(value + key);
    expect(value).toBe("(941) 374-8014");
  });

  it("re-formats cleanly after deleting characters", () => {
    expect(formatUsPhone("(941) ")).toBe("(941");
    expect(formatUsPhone("(941) 374-")).toBe("(941) 374");
  });
});

describe("normalizeUsPhone", () => {
  it("accepts complete US numbers in any common format", () => {
    expect(normalizeUsPhone("9413748014")).toBe("(941) 374-8014");
    expect(normalizeUsPhone("+1 941.374.8014")).toBe("(941) 374-8014");
  });

  it("rejects incomplete numbers and text", () => {
    expect(normalizeUsPhone("941374")).toBeNull();
    expect(normalizeUsPhone("call me")).toBeNull();
    expect(normalizeUsPhone("941-374-8014 ext 2")).toBeNull();
  });
});

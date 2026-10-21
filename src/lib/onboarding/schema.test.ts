import { describe, expect, it } from "vitest";

import { safeFileName, submissionEnvelope, validateStep } from "./schema";
import type { Field } from "./types";

const fields: Field[] = [
  { name: "businessName", label: "Business name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel" },
  { name: "website", label: "Website", type: "url" },
  { name: "about", label: "About", type: "textarea", max: 20 },
  { name: "budget", label: "Budget", type: "select", required: true, options: ["Low", "High"] },
  { name: "agency", label: "Agency?", type: "radio", options: ["Yes", "No"] },
  {
    name: "personality",
    label: "Personality",
    type: "checkboxes",
    max: 2,
    options: ["Bold", "Calm", "Fun"],
  },
];

const valid = {
  businessName: "  Acme Plumbing ",
  email: "owner@acme.com",
  phone: "",
  website: "acme.com",
  about: "Line one\nLine two",
  budget: "High",
  personality: ["Bold"],
};

describe("validateStep", () => {
  it("accepts valid values, trims and normalises URLs", () => {
    const r = validateStep(fields, valid);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.businessName).toBe("Acme Plumbing");
    expect(r.data.website).toBe("https://acme.com");
    expect(r.data.agency).toBe(""); // missing optional → empty
  });

  it("reports one message per invalid field", () => {
    const r = validateStep(fields, {
      businessName: " ",
      email: "nope",
      phone: "call me",
      website: "javascript:alert(1)",
      about: "x".repeat(21),
      budget: "Medium",
      agency: "Maybe",
      personality: ["Bold", "Calm", "Fun"],
    });
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.errors).sort()).toEqual(
      [
        "about",
        "agency",
        "budget",
        "businessName",
        "email",
        "personality",
        "phone",
        "website",
      ].sort(),
    );
    expect(r.errors.personality).toMatch(/up to 2/);
  });

  it("requires at least one choice for required checkboxes and strips unknown keys", () => {
    const req: Field[] = [{ ...fields[7], required: true }];
    expect(validateStep(req, {}).ok).toBe(false);
    const r = validateStep(fields, { ...valid, injected: "x" });
    expect(r.ok && "injected" in r.data).toBe(false);
  });

  it("normalises US phone numbers", () => {
    const r = validateStep(fields, { ...valid, phone: "+1 941 374 8014" });
    expect(r.ok && r.data.phone).toBe("(941) 374-8014");
    expect(validateStep(fields, { ...valid, phone: "94137" }).ok).toBe(false);
  });

  it("rejects control characters in single-line fields", () => {
    expect(validateStep(fields, { ...valid, businessName: "Acme\u0000" }).ok).toBe(false);
  });
});

describe("submissionEnvelope", () => {
  const base = {
    submissionId: "3f1c2b6a-5a8e-4a52-9f0e-2b9d8c7e6a10",
    service: "ppc",
    business: {},
    goals: {},
    details: {},
    files: [],
  };

  it("accepts a well-formed envelope", () => {
    expect(submissionEnvelope.safeParse(base).success).toBe(true);
  });

  it("rejects bad ids, services and file types", () => {
    expect(submissionEnvelope.safeParse({ ...base, submissionId: "x" }).success).toBe(false);
    expect(submissionEnvelope.safeParse({ ...base, service: "not_sure" }).success).toBe(false);
    const exe = {
      slot: "logo",
      path: "p",
      fileName: "a.exe",
      mimeType: "application/x-msdownload",
      size: 10,
    };
    expect(submissionEnvelope.safeParse({ ...base, files: [exe] }).success).toBe(false);
  });
});

describe("safeFileName", () => {
  it("keeps names path-safe", () => {
    expect(safeFileName("../../etc/passwd")).toBe("etc-passwd");
    expect(safeFileName("Brand Guide (final).pdf")).toBe("Brand-Guide-final-.pdf");
    expect(safeFileName("///")).toBe("file");
  });
});

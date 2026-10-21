import { describe, expect, it } from "vitest";

import { contactSchema, serviceFromSlug } from "./contact";

const valid = {
  fullName: "  Jane Smith ",
  email: "Jane@Example.COM",
  phone: "",
  company: "",
  service: "ppc",
  message: "We need more booked jobs in Dallas.",
};

describe("contactSchema", () => {
  it("accepts a valid submission, trimming and normalising", () => {
    const r = contactSchema.parse(valid);
    expect(r.fullName).toBe("Jane Smith");
    expect(r.email).toBe("jane@example.com");
    expect(r.phone).toBeUndefined();
    expect(r.company).toBeUndefined();
  });

  it("reports a message per invalid field", () => {
    const r = contactSchema.safeParse({
      fullName: " ",
      email: "nope",
      phone: "call me",
      service: "seo",
      message: "hi",
    });
    expect(r.success).toBe(false);
    const fields = Object.keys(r.error!.flatten().fieldErrors).sort();
    expect(fields).toEqual(["email", "fullName", "message", "phone", "service"]);
  });

  it("rejects control characters but allows newlines in the message", () => {
    expect(contactSchema.safeParse({ ...valid, fullName: "Jane\u0000" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "Line one\nLine two here" }).success).toBe(
      true,
    );
  });

  it("stores US phone numbers as (555) 123-4567 and rejects partial ones", () => {
    expect(contactSchema.parse({ ...valid, phone: "941-374-8014" }).phone).toBe("(941) 374-8014");
    expect(contactSchema.safeParse({ ...valid, phone: "374-8014" }).success).toBe(false);
  });

  it("caps lengths", () => {
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(5001) }).success).toBe(false);
  });
});

describe("serviceFromSlug", () => {
  it("maps URL slugs to enum values", () => {
    expect(serviceFromSlug("local-seo")).toBe("local_seo");
    expect(serviceFromSlug("funnel-building")).toBe("funnel_building");
    expect(serviceFromSlug("hacking")).toBeUndefined();
    expect(serviceFromSlug(undefined)).toBeUndefined();
  });
});

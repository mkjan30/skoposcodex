import { beforeEach, describe, expect, it, vi } from "vitest";

import { initialContactState } from "./contact-state";

const insert = vi.fn();
const sendEmail = vi.fn();
const verifyTurnstile = vi.fn();
const withinRateLimit = vi.fn();

vi.mock("next/headers", () => ({ headers: async () => new Headers({ "user-agent": "vitest" }) }));
vi.mock("@/lib/security", () => ({
  clientIp: async () => "203.0.113.7",
  hashIp: () => "hash123",
  verifyTurnstile: (...a: unknown[]) => verifyTurnstile(...a),
  withinRateLimit: (...a: unknown[]) => withinRateLimit(...a),
}));
vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => ({
    from: () => ({
      insert: (row: unknown) => {
        insert(row);
        return { select: () => ({ single: async () => insert.mock.results.at(-1)?.value }) };
      },
    }),
  }),
}));
vi.mock("@/lib/email", async (orig) => ({
  ...(await orig<typeof import("@/lib/email")>()),
  sendEmail: (...a: unknown[]) => sendEmail(...a),
}));

const { submitContact } = await import("./contact");

function form(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  const fields = {
    fullName: "Jane Smith",
    email: "jane@example.com",
    service: "ppc",
    message: "We need more booked jobs in Dallas.",
    "cf-turnstile-response": "token",
    sourcePage: "/contact?service=ppc&utm_source=google&utm_campaign=spring",
    ...overrides,
  };
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.EMAIL_ADMIN_TO = "team@example.com";
  verifyTurnstile.mockResolvedValue(true);
  withinRateLimit.mockResolvedValue(true);
  insert.mockReturnValue({ data: { id: "lead-1" }, error: null });
  sendEmail.mockResolvedValue(undefined);
});

describe("submitContact", () => {
  it("saves the lead with UTM data and sends both emails", async () => {
    const r = await submitContact(initialContactState, form());
    expect(r).toEqual({ status: "success", firstName: "Jane" });
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: "Jane Smith",
        service: "ppc",
        ip_hash: "hash123",
        utm: { utm_source: "google", utm_campaign: "spring" },
        user_agent: "vitest",
      }),
    );
    expect(sendEmail.mock.calls.map((c) => c[0].to)).toEqual([
      "team@example.com",
      "jane@example.com",
    ]);
  });

  it("silently drops honeypot submissions", async () => {
    const r = await submitContact(initialContactState, form({ website: "spam.com" }));
    expect(r.status).toBe("success");
    expect(insert).not.toHaveBeenCalled();
    expect(verifyTurnstile).not.toHaveBeenCalled();
  });

  it("rejects a failed spam check without saving", async () => {
    verifyTurnstile.mockResolvedValue(false);
    const r = await submitContact(initialContactState, form());
    expect(r.status).toBe("error");
    expect(r.message).toMatch(/spam check/);
    expect(r.values?.fullName).toBe("Jane Smith");
    expect(insert).not.toHaveBeenCalled();
  });

  it("rate-limits", async () => {
    withinRateLimit.mockResolvedValue(false);
    const r = await submitContact(initialContactState, form());
    expect(r.message).toMatch(/Too many attempts/);
    expect(insert).not.toHaveBeenCalled();
  });

  it("returns one message per invalid field and keeps the input", async () => {
    const r = await submitContact(initialContactState, form({ email: "nope", message: "hi" }));
    expect(Object.keys(r.fieldErrors ?? {}).sort()).toEqual(["email", "message"]);
    expect(r.values?.email).toBe("nope");
    expect(r.attempt).toBe(1);
    expect((await submitContact(r, form({ email: "nope" }))).attempt).toBe(2);
    expect(insert).not.toHaveBeenCalled();
  });

  it("still succeeds when email sending fails", async () => {
    sendEmail.mockRejectedValue(new Error("Resend down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await submitContact(initialContactState, form());
    expect(r.status).toBe("success");
  });

  it("reports a generic error when the database insert fails", async () => {
    insert.mockReturnValue({ data: null, error: new Error("db down") });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await submitContact(initialContactState, form());
    expect(r.status).toBe("error");
    expect(r.message).toMatch(/still in the form/);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});

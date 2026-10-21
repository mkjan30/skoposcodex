import { beforeEach, describe, expect, it, vi } from "vitest";

const upsert = vi.fn();
const exists = vi.fn();
const sendEmail = vi.fn();
const verifyTurnstile = vi.fn();
const withinRateLimit = vi.fn();

vi.mock("@/content/onboarding/shared", () => ({
  businessFields: [
    { name: "businessName", label: "Business name", type: "text", required: true },
    { name: "contactName", label: "Your name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel", required: true },
    { name: "websiteUrl", label: "Website", type: "url" },
  ],
  onboardingUploads: [{ slot: "assets", label: "Files" }],
  goalsFields: [
    { name: "monthlyBudget", label: "Budget", type: "select", required: true, options: ["$1–2k"] },
  ],
}));
vi.mock("@/content/onboarding/services", () => ({
  getOnboardingService: (k: string) =>
    k === "ppc"
      ? {
          key: "ppc",
          label: "PPC Advertising",
          description: "",
          details: [
            {
              name: "platforms",
              label: "Platforms",
              type: "checkboxes",
              required: true,
              options: ["Google", "Meta"],
            },
          ],
          access: [],
        }
      : undefined,
}));
vi.mock("@/lib/security", () => ({
  clientIp: async () => "203.0.113.9",
  hashIp: () => "hash",
  verifyTurnstile: (...a: unknown[]) => verifyTurnstile(...a),
  withinRateLimit: (...a: unknown[]) => withinRateLimit(...a),
}));
vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => ({
    from: (table: string) => ({
      upsert: (rows: unknown, opts: unknown) => upsert(table, rows, opts),
    }),
    storage: { from: () => ({ exists: (p: string) => exists(p) }) },
  }),
}));
vi.mock("@/lib/email", async (orig) => ({
  ...(await orig<typeof import("@/lib/email")>()),
  sendEmail: (...a: unknown[]) => sendEmail(...a),
}));

const { submitOnboarding } = await import("./onboarding");

const ID = "3f1c2b6a-5a8e-4a52-9f0e-2b9d8c7e6a10";
const payload = (over: Record<string, unknown> = {}) => ({
  submissionId: ID,
  service: "ppc",
  business: {
    businessName: "Acme",
    contactName: "Jane Smith",
    email: "jane@acme.com",
    phone: "+1 555 000 1111",
    websiteUrl: "acme.com",
  },
  goals: { monthlyBudget: "$1–2k" },
  details: { platforms: ["Google"] },
  files: [
    {
      slot: "assets",
      path: `${ID}/assets/abc-report.pdf`,
      fileName: "report.pdf",
      mimeType: "application/pdf",
      size: 1000,
    },
  ],
  ...over,
});

beforeEach(() => {
  vi.clearAllMocks();
  process.env.EMAIL_ADMIN_TO = "team@example.com";
  verifyTurnstile.mockResolvedValue(true);
  withinRateLimit.mockResolvedValue(true);
  exists.mockResolvedValue({ data: true, error: null });
  upsert.mockResolvedValue({ error: null });
  sendEmail.mockResolvedValue(undefined);
});

describe("submitOnboarding", () => {
  it("saves submission + files idempotently, promotes columns and emails both sides", async () => {
    expect(await submitOnboarding(payload(), "tok")).toEqual({ ok: true });
    const [table, row, opts] = upsert.mock.calls[0];
    expect(table).toBe("onboarding_submissions");
    expect(row).toMatchObject({
      id: ID,
      service: "ppc",
      business_name: "Acme",
      contact_email: "jane@acme.com",
      website_url: "https://acme.com",
      monthly_budget: "$1–2k",
      details: { platforms: ["Google"] },
    });
    expect(opts).toEqual({ onConflict: "id", ignoreDuplicates: true });
    expect(upsert.mock.calls[1][0]).toBe("onboarding_files");
    expect(sendEmail.mock.calls.map((c) => c[0].to)).toEqual(["team@example.com", "jane@acme.com"]);
  });

  it("returns the step and field errors for invalid answers without saving", async () => {
    const r = await submitOnboarding(payload({ details: { platforms: [] } }), "tok");
    expect(r).toMatchObject({ ok: false, step: 3, errors: { platforms: expect.any(String) } });
    expect(upsert).not.toHaveBeenCalled();
  });

  it("rejects files outside the submission's own folder or with an unknown slot", async () => {
    const stranger = payload({
      files: [{ ...payload().files[0], path: "other-id/assets/x.pdf" }],
    });
    expect(await submitOnboarding(stranger, "tok")).toMatchObject({ ok: false, step: 3 });
    const wrongSlot = payload({
      files: [{ ...payload().files[0], slot: "logo", path: `${ID}/logo/x.pdf` }],
    });
    expect(await submitOnboarding(wrongSlot, "tok")).toMatchObject({ ok: false, step: 3 });
    expect(upsert).not.toHaveBeenCalled();
  });

  it("rejects files that never finished uploading", async () => {
    exists.mockResolvedValue({ data: false, error: null });
    expect(await submitOnboarding(payload(), "tok")).toMatchObject({ ok: false, step: 3 });
    expect(upsert).not.toHaveBeenCalled();
  });

  it("blocks failed spam checks and rate-limited callers", async () => {
    verifyTurnstile.mockResolvedValueOnce(false);
    expect((await submitOnboarding(payload(), null)).ok).toBe(false);
    withinRateLimit.mockResolvedValueOnce(false);
    expect(await submitOnboarding(payload(), "tok")).toMatchObject({ message: /Too many/ });
    expect(upsert).not.toHaveBeenCalled();
  });

  it("still succeeds when email fails, and reports a generic error when the DB fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    sendEmail.mockRejectedValue(new Error("down"));
    expect(await submitOnboarding(payload(), "tok")).toEqual({ ok: true });
    upsert.mockResolvedValueOnce({ error: new Error("db down") });
    expect(await submitOnboarding(payload(), "tok")).toMatchObject({
      ok: false,
      message: /saved in this browser/,
    });
  });

  it("rejects malformed envelopes", async () => {
    expect((await submitOnboarding({ hello: "world" }, "tok")).ok).toBe(false);
    expect((await submitOnboarding(payload({ service: "seo" }), "tok")).ok).toBe(false);
  });
});

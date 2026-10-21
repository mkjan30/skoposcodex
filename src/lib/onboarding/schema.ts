import { z } from "zod";

import type { Field, FieldValue, ServiceKey, StepValues, UploadedFile } from "./types";

const MAX_LEN: Record<Field["type"], number> = {
  text: 160,
  email: 254,
  tel: 40,
  url: 2048,
  textarea: 5000,
  select: 160,
  radio: 160,
  checkboxes: 160,
};
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/; // newlines/tabs allowed
const SINGLE_LINE_CONTROL = /[\u0000-\u001F\u007F]/;

export const SERVICE_KEYS = [
  "local_seo",
  "ppc",
  "website_design",
  "funnel_building",
  "branding",
] as const satisfies readonly ServiceKey[];

/** Adds https:// to bare domains so "example.com" is accepted. */
const withScheme = (s: string) => (s && !/^https?:\/\//i.test(s) ? `https://${s}` : s);

function fieldSchema(f: Field): z.ZodType<FieldValue> {
  if (f.type === "checkboxes") {
    const options = f.options ?? [];
    let s = z.array(z.string().refine((v) => options.includes(v), "Invalid choice."));
    if (f.max) s = s.max(f.max, `Choose up to ${f.max}.`);
    if (f.required) s = s.min(1, "Choose at least one.");
    return z.preprocess((v) => v ?? [], s);
  }

  const max = f.max ?? MAX_LEN[f.type];
  const s = z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .refine(
      (v) => !(f.type === "textarea" ? CONTROL : SINGLE_LINE_CONTROL).test(v),
      "Contains invalid characters.",
    )
    .transform((v) => (f.type === "url" ? withScheme(v) : v))
    .refine((v) => !f.required || v.length > 0, "This field is required.")
    .refine(
      (v) => !v || f.type !== "email" || z.email().safeParse(v).success,
      "Enter a valid email.",
    )
    .refine(
      (v) => !v || f.type !== "tel" || /^[+()\-.\s\d]{7,40}$/.test(v),
      "Enter a valid phone number.",
    )
    .refine(
      (v) => !v || f.type !== "url" || z.url({ protocol: /^https?$/ }).safeParse(v).success,
      "Enter a valid web address.",
    )
    .refine(
      (v) => !v || !(f.type === "select" || f.type === "radio") || !!f.options?.includes(v),
      "Choose one of the options.",
    );
  return z.preprocess((v) => v ?? "", s);
}

/** Zod object for one wizard step; unknown keys are stripped. */
export function stepSchema(fields: Field[]) {
  return z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])));
}

export type StepResult =
  { ok: true; data: StepValues } | { ok: false; errors: Record<string, string> };

/** Validates one step; errors map field name → first message. */
export function validateStep(fields: Field[], values: StepValues | undefined): StepResult {
  const r = stepSchema(fields).safeParse(values ?? {});
  if (r.success) return { ok: true, data: r.data as StepValues };
  const errors: Record<string, string> = {};
  for (const i of r.error.issues) {
    const key = String(i.path[0]);
    errors[key] ??= i.message;
  }
  return { ok: false, errors };
}

/** Private storage bucket (supabase/migrations/0002_storage.sql). */
export const BUCKET = "onboarding-files";
export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
/** Mirrors the onboarding-files bucket allow-list (supabase/migrations/0002_storage.sql). */
export const ALLOWED_MIME: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  webp: "image/webp",
  zip: "application/zip",
  ai: "application/postscript",
  eps: "application/postscript",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export const uploadedFileSchema = z.object({
  slot: z.string().regex(/^[a-z0-9_]{1,40}$/),
  path: z.string().max(400),
  fileName: z.string().trim().min(1).max(200),
  mimeType: z.string().refine((m) => Object.values(ALLOWED_MIME).includes(m)),
  size: z.number().int().positive().max(MAX_FILE_BYTES),
}) satisfies z.ZodType<UploadedFile>;

/** Top-level shape; step contents are validated per field config afterwards. */
export const submissionEnvelope = z.object({
  submissionId: z.uuid(),
  service: z.enum(SERVICE_KEYS),
  business: z.record(z.string(), z.unknown()),
  goals: z.record(z.string(), z.unknown()),
  details: z.record(z.string(), z.unknown()),
  files: z.array(uploadedFileSchema).max(MAX_FILES),
});

/** Safe object-path segment for an uploaded file name. */
export function safeFileName(name: string) {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+/, "")
    .slice(-100);
  return cleaned || "file";
}

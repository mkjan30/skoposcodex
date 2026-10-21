// One field config drives the wizard UI, client validation and server validation (schema.ts).

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "textarea"
  | "select" // single choice from a dropdown
  | "radio" // single choice shown as buttons; best for 2–5 short options
  | "checkboxes"; // multiple choice

export type Field = {
  /** camelCase key stored in the step's jsonb column. */
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Choices for select / radio / checkboxes. */
  options?: readonly string[];
  placeholder?: string;
  /** One-line hint under the label. */
  help?: string;
  /** Max characters (text types) or max selections (checkboxes). */
  max?: number;
  /** Render at half width on desktop (pairs of short fields). */
  half?: boolean;
};

export type UploadSlot = {
  /** Stored in onboarding_files.slot, e.g. "logo". */
  slot: string;
  label: string;
  help?: string;
};

/** Matches the Postgres service_type enum, minus "not_sure". */
export type ServiceKey = "local_seo" | "ppc" | "website_design" | "funnel_building" | "branding";

export type ServiceOnboarding = {
  key: ServiceKey;
  label: string;
  /** One line on the step-1 card. */
  description: string;
  /** Step 4 questions. */
  details: Field[];
  /** Step 5 upload slots (all optional). */
  uploads: UploadSlot[];
  /** Step 5: platforms the client should invite us to as a user — never passwords. */
  access: { platform: string; how: string }[];
};

export type FieldValue = string | string[];
export type StepValues = Record<string, FieldValue>;

export type UploadedFile = {
  slot: string;
  /** Object path inside the onboarding-files bucket. */
  path: string;
  fileName: string;
  mimeType: string;
  size: number;
};

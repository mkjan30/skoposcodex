// Zod-free so the client form can import it without bundling the validation library.
// Values match the Postgres `service_type` enum (supabase/migrations/0001_init.sql).
export const contactServices = [
  { value: "local_seo", label: "Local SEO" },
  { value: "ppc", label: "PPC Advertising" },
  { value: "website_design", label: "Website Design" },
  { value: "funnel_building", label: "Funnel Building" },
  { value: "branding", label: "Branding" },
  { value: "not_sure", label: "Not sure yet" },
] as const;

export type ServiceValue = (typeof contactServices)[number]["value"];
export const serviceValues = contactServices.map((s) => s.value) as [
  ServiceValue,
  ...ServiceValue[],
];

/** Maps a URL slug like "local-seo" to its enum value, or undefined if unknown. */
export function serviceFromSlug(slug: string | undefined): ServiceValue | undefined {
  const v = slug?.replace(/-/g, "_");
  return serviceValues.find((s) => s === v);
}

export const contactFields = [
  "fullName",
  "email",
  "phone",
  "company",
  "service",
  "message",
] as const;
export type ContactField = (typeof contactFields)[number];

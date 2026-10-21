import type { ContactField } from "@/lib/contact-services";

// Kept out of the "use server" file, which may only export async functions.
export type ContactState = {
  status: "idle" | "success" | "error";
  /** Shown above the form for non-field errors (spam check, rate limit, server failure). */
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string>>;
  /** Echoed back so the form keeps what the user typed after an error. */
  values?: Partial<Record<ContactField, string>>;
  firstName?: string;
  /** Increments on each failed submit; keys the fields so they remount with `values` as defaults. */
  attempt?: number;
};

export const initialContactState: ContactState = { status: "idle" };

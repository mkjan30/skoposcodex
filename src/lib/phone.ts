/** A complete US number as stored and displayed: "(555) 123-4567". */
export const US_PHONE = /^\(\d{3}\) \d{3}-\d{4}$/;

/**
 * Formats input as a US number while typing: "9413748014" → "(941) 374-8014".
 * Drops the +1 country code and ignores digits past 10.
 */
export function formatUsPhone(input: string): string {
  // US area codes never start with 0 or 1, so a leading 1 is always the +1 country code —
  // dropping it here also works mid-typing ("+1 9…"), not just for pasted numbers.
  let d = input.replace(/\D/g, "").replace(/^1/, "");
  d = d.slice(0, 10);
  if (!d) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export const US_PHONE_MESSAGE = "Enter a 10-digit US phone number, e.g. (555) 123-4567.";

/** Server-side: accepts any common way of typing a US number and returns "(555) 123-4567", or null. */
export function normalizeUsPhone(input: string): string | null {
  if (/[^+()\-.\s\d]/.test(input)) return null; // letters etc.
  const f = formatUsPhone(input);
  return US_PHONE.test(f) ? f : null;
}

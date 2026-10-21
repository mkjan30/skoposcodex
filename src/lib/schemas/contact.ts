import { z } from "zod";

import { serviceValues } from "@/lib/contact-services";

export { contactServices, serviceFromSlug, type ContactField } from "@/lib/contact-services";

// Trims, rejects control characters (except newlines/tabs in long text) and caps length.
const text = (max: number, opts: { multiline?: boolean } = {}) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .refine(
      (s) =>
        !(
          opts.multiline
            ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/
            : /[\u0000-\u001F\u007F]/
        ).test(s),
      "Contains invalid characters.",
    );

const optional = (max: number) =>
  text(max)
    .optional()
    .transform((s) => s || undefined);

export const contactSchema = z.object({
  fullName: text(120).pipe(z.string().min(1, "Please enter your name.")),
  email: text(254)
    .pipe(z.email("Please enter a valid email address."))
    .transform((s) => s.toLowerCase()),
  phone: optional(40).refine(
    (s) => !s || /^[+()\-.\s\d]{7,40}$/.test(s),
    "Please enter a valid phone number.",
  ),
  company: optional(160),
  service: z.enum(serviceValues, { error: "Please choose a service." }),
  message: text(5000, { multiline: true }).pipe(
    z.string().min(10, "Please tell us a little more (at least 10 characters)."),
  ),
});

export type ContactInput = z.infer<typeof contactSchema>;

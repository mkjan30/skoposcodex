"use server";

import { headers } from "next/headers";

import type { ContactState } from "@/app/actions/contact-state";
import { sendEmail } from "@/lib/email";
import { adminLeadEmail, leadConfirmationEmail } from "@/lib/emails/contact";
import { contactFields, type ContactField } from "@/lib/contact-services";
import { contactSchema } from "@/lib/schemas/contact";
import { clientIp, hashIp, verifyTurnstile, withinRateLimit } from "@/lib/security";
import { isSalesPitch } from "@/lib/spam";
import { createAdminClient } from "@/lib/supabase/server";

const GENERIC_ERROR =
  "Something went wrong on our side. Your message is still in the form — please try again in a minute.";

export async function submitContact(prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = Object.fromEntries(
    contactFields.map((f) => [f, String(formData.get(f) ?? "").slice(0, 6000)]),
  ) as Record<ContactField, string>;
  const fail = (extra: Pick<ContactState, "message" | "fieldErrors">): ContactState => ({
    status: "error",
    values,
    attempt: (prev.attempt ?? 0) + 1,
    ...extra,
  });

  // Honeypot: real users never see this field. Pretend success so bots learn nothing.
  if (formData.get("website")) return { status: "success", firstName: "there" };

  try {
    const ip = await clientIp();
    if (!(await verifyTurnstile(formData.get("cf-turnstile-response") as string | null, ip))) {
      return fail({ message: "Please complete the spam check and try again." });
    }

    // Validate before the rate limit: invalid input costs no database write.
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = Object.fromEntries(
        parsed.error.issues.map((i) => [i.path[0], i.message]).reverse(), // first issue per field wins
      );
      return fail({ fieldErrors });
    }
    const lead = parsed.data;

    const ipHash = hashIp(ip);
    if (!(await withinRateLimit(`contact:${ipHash}`, 5, 3600))) {
      return fail({ message: "Too many attempts from your connection. Please try again later." });
    }

    const sourcePage = String(formData.get("sourcePage") ?? "").slice(0, 300);
    const utm = Object.fromEntries(
      [...new URLSearchParams(sourcePage.split("?")[1] ?? "")]
        .filter(([k]) => k.startsWith("utm_"))
        .map(([k, v]) => [k, v.slice(0, 200)]),
    );

    // Cold sales pitches are kept (status "spam", reviewable in Supabase) but trigger no emails.
    const spam = isSalesPitch(lead.message);

    const { data, error } = await createAdminClient()
      .from("leads")
      .insert({
        full_name: lead.fullName,
        email: lead.email,
        phone: lead.phone ?? null,
        company: lead.company ?? null,
        service: lead.service,
        message: lead.message,
        source_page: sourcePage || null,
        utm,
        ip_hash: ipHash,
        user_agent: (await headers()).get("user-agent")?.slice(0, 500) ?? null,
        ...(spam && { status: "spam" as const }),
      })
      .select("id")
      .single();
    if (error) throw error;
    if (spam) return { status: "success", firstName: lead.fullName.split(/\s+/)[0] };

    // The lead is saved; email problems are logged but never fail the submission (TRD §6).
    const adminTo = process.env.EMAIL_ADMIN_TO;
    const results = await Promise.allSettled([
      adminTo
        ? sendEmail({ to: adminTo, replyTo: lead.email, ...adminLeadEmail(lead, data.id) })
        : Promise.reject(new Error("EMAIL_ADMIN_TO is not configured.")),
      sendEmail({ to: lead.email, ...leadConfirmationEmail(lead) }),
    ]);
    for (const r of results) {
      if (r.status === "rejected") console.error("[contact] email failed", data.id, r.reason);
    }

    return { status: "success", firstName: lead.fullName.split(/\s+/)[0] };
  } catch (err) {
    console.error("[contact] submission failed", err);
    return fail({ message: GENERIC_ERROR });
  }
}

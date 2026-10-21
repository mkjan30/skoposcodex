"use server";

import { businessFields, goalsFields, onboardingUploads } from "@/content/onboarding/shared";
import { getOnboardingService } from "@/content/onboarding/services";
import { sendEmail } from "@/lib/email";
import { adminOnboardingEmail, clientOnboardingEmail } from "@/lib/emails/onboarding";
import { BUCKET, submissionEnvelope, validateStep } from "@/lib/onboarding/schema";
import type { StepValues } from "@/lib/onboarding/types";
import { clientIp, hashIp, verifyTurnstile, withinRateLimit } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/server";

export type OnboardingResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      /** Wizard step to jump back to (2 about you, 3 goals/details/files). */
      step?: number;
      errors?: Record<string, string>;
    };

const GENERIC =
  "Something went wrong on our side. Your answers are saved in this browser — please try again in a minute.";

export async function submitOnboarding(
  input: unknown,
  turnstileToken: string | null,
): Promise<OnboardingResult> {
  try {
    const ip = await clientIp();
    if (!(await verifyTurnstile(turnstileToken, ip))) {
      return { ok: false, message: "Please complete the spam check and try again." };
    }

    const env = submissionEnvelope.safeParse(input);
    if (!env.success)
      return { ok: false, message: "Some answers are invalid. Please review them." };
    const { submissionId, files } = env.data;
    const service = getOnboardingService(env.data.service)!;

    // Re-validate every step against the same field config the browser used.
    const steps = [
      { step: 2, title: "About you", fields: businessFields, raw: env.data.business },
      { step: 3, title: "Goals", fields: goalsFields, raw: env.data.goals },
      {
        step: 3,
        title: `${service.label} details`,
        fields: service.details,
        raw: env.data.details,
      },
    ];
    const clean: StepValues[] = [];
    for (const s of steps) {
      const r = validateStep(s.fields, s.raw as StepValues);
      if (!r.ok)
        return {
          ok: false,
          step: s.step,
          errors: r.errors,
          message: "Please fix the highlighted answers.",
        };
      clean.push(r.data);
    }
    const [business, goals, details] = clean;

    const slots = new Set(onboardingUploads.map((u) => u.slot));
    const badFile = files.find(
      (f) => !slots.has(f.slot) || !f.path.startsWith(`${submissionId}/${f.slot}/`),
    );
    if (badFile)
      return {
        ok: false,
        step: 3,
        message: "One of the uploaded files is invalid. Please remove it and try again.",
      };

    const ipHash = hashIp(ip);
    if (!(await withinRateLimit(`onboard:${ipHash}`, 5, 3600))) {
      return {
        ok: false,
        message: "Too many attempts from your connection. Please try again later.",
      };
    }

    const db = createAdminClient();
    const storage = db.storage.from(BUCKET);
    for (const f of files) {
      const { data: exists } = await storage.exists(f.path);
      if (!exists) {
        return {
          ok: false,
          step: 3,
          message: `“${f.fileName}” didn't finish uploading. Please remove it and upload it again.`,
        };
      }
    }

    // Idempotent: a retried submit with the same client-generated id is a no-op.
    const { error } = await db.from("onboarding_submissions").upsert(
      {
        id: submissionId,
        service: service.key,
        business_name: business.businessName,
        contact_name: business.contactName,
        contact_email: business.email,
        contact_phone: business.phone || null,
        website_url: business.websiteUrl || null,
        monthly_budget: goals.monthlyBudget || null,
        business,
        goals,
        details,
        ip_hash: ipHash,
      },
      { onConflict: "id", ignoreDuplicates: true },
    );
    if (error) throw error;

    if (files.length) {
      const { error: fileError } = await db.from("onboarding_files").upsert(
        files.map((f) => ({
          submission_id: submissionId,
          slot: f.slot,
          storage_path: f.path,
          file_name: f.fileName,
          mime_type: f.mimeType,
          size_bytes: f.size,
        })),
        { onConflict: "storage_path", ignoreDuplicates: true },
      );
      if (fileError) throw fileError;
    }

    // Saved; email failures are logged, never fatal.
    const adminTo = process.env.EMAIL_ADMIN_TO;
    const sections = steps.map((s, i) => ({ title: s.title, fields: s.fields, values: clean[i] }));
    const results = await Promise.allSettled([
      adminTo
        ? sendEmail({
            to: adminTo,
            replyTo: String(business.email),
            ...adminOnboardingEmail(service, sections, files, submissionId),
          })
        : Promise.reject(new Error("EMAIL_ADMIN_TO is not configured.")),
      sendEmail({
        to: String(business.email),
        ...clientOnboardingEmail(String(business.contactName), service),
      }),
    ]);
    for (const r of results) {
      if (r.status === "rejected")
        console.error("[onboarding] email failed", submissionId, r.reason);
    }

    return { ok: true };
  } catch (err) {
    console.error("[onboarding] submission failed", err);
    return { ok: false, message: GENERIC };
  }
}

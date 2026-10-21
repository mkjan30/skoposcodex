import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { onboardingUploads } from "@/content/onboarding/shared";
import { ALLOWED_MIME, BUCKET, MAX_FILE_BYTES, safeFileName } from "@/lib/onboarding/schema";
import { clientIp, hashIp, withinRateLimit } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/server";

const SLOTS = new Set(onboardingUploads.map((u) => u.slot));

const body = z.object({
  submissionId: z.uuid(),
  slot: z.string().refine((s) => SLOTS.has(s), "Unknown upload slot."),
  fileName: z.string().trim().min(1).max(200),
  size: z.number().int().positive().max(MAX_FILE_BYTES, "Files must be 25 MB or smaller."),
  mimeType: z
    .string()
    .refine((m) => Object.values(ALLOWED_MIME).includes(m), "File type not allowed."),
});

/**
 * Issues a one-time signed upload URL so the browser uploads straight to the private bucket.
 * Objects live at {submissionId}/{slot}/{uuid}-{name}; the submit action only accepts paths
 * under the submission's own prefix.
 */
export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }
  const { submissionId, slot, fileName } = parsed.data;

  try {
    const ipHash = hashIp(await clientIp());
    if (!(await withinRateLimit(`upload:${ipHash}`, 40, 3600))) {
      return NextResponse.json(
        { error: "Too many uploads. Please try again later." },
        { status: 429 },
      );
    }
    const path = `${submissionId}/${slot}/${randomUUID()}-${safeFileName(fileName)}`;
    const { data, error } = await createAdminClient()
      .storage.from(BUCKET)
      .createSignedUploadUrl(path);
    if (error) throw error;
    return NextResponse.json({ signedUrl: data.signedUrl, path });
  } catch (err) {
    console.error("[upload-url] failed", err);
    return NextResponse.json(
      { error: "Upload is unavailable right now. Please try again." },
      { status: 503 },
    );
  }
}

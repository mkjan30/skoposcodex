import { site } from "@/content/site";
import { escapeHtml } from "@/lib/email";
import type { Field, ServiceOnboarding, StepValues, UploadedFile } from "@/lib/onboarding/types";

type Sections = { title: string; fields: Field[]; values: StepValues }[];

const show = (v: StepValues[string] | undefined) => (Array.isArray(v) ? v.join(", ") : (v ?? ""));

/** Full answers for the team, grouped by step; empty answers are skipped. */
export function adminOnboardingEmail(
  service: ServiceOnboarding,
  sections: Sections,
  files: UploadedFile[],
  submissionId: string,
) {
  const business = sections[0].values;
  const rows = (s: Sections[number]) =>
    s.fields.filter((f) => show(s.values[f.name])).map((f) => [f.label, show(s.values[f.name])]);

  const text = [
    `New onboarding: ${business.businessName} — ${service.label}`,
    "",
    ...sections.flatMap((s) => [`## ${s.title}`, ...rows(s).map(([k, v]) => `${k}: ${v}`), ""]),
    `## Files (${files.length})`,
    ...files.map((f) => `${f.slot}: ${f.fileName}`),
    "",
    `Submission ID: ${submissionId}`,
  ].join("\n");

  const html = `<h2>New onboarding: ${escapeHtml(String(business.businessName))} — ${escapeHtml(service.label)}</h2>
${sections
  .map(
    (s) =>
      `<h3>${escapeHtml(s.title)}</h3><table cellpadding="4">${rows(s)
        .map(
          ([k, v]) =>
            `<tr><td valign="top"><strong>${escapeHtml(k)}</strong></td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
        )
        .join("")}</table>`,
  )
  .join("")}
<h3>Files (${files.length})</h3><ul>${files.map((f) => `<li>${escapeHtml(f.slot)}: ${escapeHtml(f.fileName)}</li>`).join("")}</ul>
<p style="color:#888">Submission ID: ${submissionId}. Files are in Supabase Storage → onboarding-files/${submissionId}/</p>`;

  return { subject: `New onboarding: ${business.businessName} — ${service.label}`, text, html };
}

/** Receipt for the client. */
/** Receipt for the client, with the access steps that used to be a form step. */
export function clientOnboardingEmail(name: string, service: ServiceOnboarding) {
  const first = name.split(/\s+/)[0];
  const invite = site.contact.email ?? "us";
  return {
    subject: `We've got your onboarding details, ${first}`,
    text: `Hi ${first},

Thanks for completing onboarding for ${service.label} with ${site.name}. A senior strategist is reviewing your answers and will reach out within 24 hours to schedule your kickoff call.

Next step — give us access (please never send passwords). Invite ${invite} as a user on:
${service.access.map((a) => `- ${a.platform}: ${a.how}`).join("\n")}

No rush: we can also do this together on the kickoff call. If anything changes in the meantime, just reply to this email.

— The ${site.name} team`,
    html: `<p>Hi ${escapeHtml(first)},</p>
<p>Thanks for completing onboarding for <strong>${escapeHtml(service.label)}</strong> with ${site.name}. A senior strategist is reviewing your answers and will reach out within 24 hours to schedule your kickoff call.</p>
<p><strong>Next step — give us access</strong> (please never send passwords). Invite <strong>${escapeHtml(invite)}</strong> as a user on:</p>
<ul>${service.access.map((a) => `<li><strong>${escapeHtml(a.platform)}:</strong> ${escapeHtml(a.how)}</li>`).join("")}</ul>
<p>No rush: we can also do this together on the kickoff call. If anything changes in the meantime, just reply to this email.</p>
<p>— The ${site.name} team</p>`,
  };
}

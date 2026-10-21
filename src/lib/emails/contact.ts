import { site } from "@/content/site";
import { escapeHtml } from "@/lib/email";
import { contactServices, type ContactInput } from "@/lib/schemas/contact";

const serviceLabel = (v: ContactInput["service"]) =>
  contactServices.find((s) => s.value === v)?.label ?? v;

export function adminLeadEmail(lead: ContactInput, leadId: string) {
  const rows: [string, string | undefined][] = [
    ["Name", lead.fullName],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Company", lead.company],
    ["Service", serviceLabel(lead.service)],
  ];
  const present = rows.filter((r): r is [string, string] => !!r[1]);
  return {
    subject: `New lead: ${lead.fullName} — ${serviceLabel(lead.service)}`,
    text: [
      ...present.map(([k, v]) => `${k}: ${v}`),
      "",
      lead.message,
      "",
      `Lead ID: ${leadId}`,
    ].join("\n"),
    html: `<h2>New lead from the website</h2>
<table cellpadding="4">${present
      .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
      .join("")}</table>
<p style="white-space:pre-wrap">${escapeHtml(lead.message)}</p>
<p style="color:#888">Lead ID: ${leadId}</p>`,
  };
}

export function leadConfirmationEmail(lead: ContactInput) {
  const first = lead.fullName.split(/\s+/)[0];
  const booking = process.env.NEXT_PUBLIC_BOOKING_URL;
  return {
    subject: `Thanks, ${first} — we got your message`,
    text: `Hi ${first},

Thanks for reaching out to ${site.name}. A senior strategist will review your message and get back to you within 24 hours to set up your free strategy call.
${booking ? `\nIf you'd like to pick a time now: ${booking}\n` : ""}
— The ${site.name} team`,
    html: `<p>Hi ${escapeHtml(first)},</p>
<p>Thanks for reaching out to ${site.name}. A senior strategist will review your message and get back to you within 24 hours to set up your free strategy call.</p>
${booking ? `<p><a href="${escapeHtml(booking)}">Pick a time now</a></p>` : ""}
<p>— The ${site.name} team</p>`,
  };
}

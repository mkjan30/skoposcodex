import "server-only";

type Email = { to: string; subject: string; html: string; text: string; replyTo?: string };

// Plain fetch to Resend's REST API; no SDK needed for a handful of transactional emails.
export async function sendEmail({ to, subject, html, text, replyTo }: Email) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) throw new Error("Email is not configured (RESEND_API_KEY, EMAIL_FROM).");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html, text, reply_to: replyTo }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

const entities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escapes user input for HTML email bodies. */
export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => entities[c]);
}

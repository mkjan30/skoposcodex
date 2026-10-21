import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects your personal information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 21, 2026">
      <p>
        {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy
        explains what information we collect through this website, why we collect it, and the
        choices you have.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Contact form:</strong> your name, email address, phone number, company, the
          service you are interested in and your message.
        </li>
        <li>
          <strong>Client onboarding:</strong> business details, goals, marketing information and any
          files you choose to upload, such as logos or reports.
        </li>
        <li>
          <strong>Usage data:</strong> pages visited, device and browser type, and referring site,
          collected through analytics only if you consent.
        </li>
        <li>
          <strong>Security data:</strong> a one-way hashed form of your IP address, used to block
          spam and abuse. We do not store your raw IP address.
        </li>
      </ul>
      <p>
        We never ask for, and you should never send us, passwords to your accounts. When we need
        access to a platform, we ask you to invite us as a user.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to your enquiry and schedule a strategy call.</li>
        <li>To plan and deliver the services you engage us for.</li>
        <li>To understand how the website is used and improve it.</li>
        <li>To keep the website secure and prevent spam.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use it for unrelated marketing.</p>

      <h2>Service providers</h2>
      <p>
        We use trusted providers to run this website: hosting (Vercel), database and file storage
        (Supabase), transactional email (Resend), spam protection (Cloudflare Turnstile) and, with
        your consent, analytics (Google Analytics). They process data only on our instructions.
      </p>

      <h2>How long we keep it</h2>
      <ul>
        <li>Enquiries: up to 24 months, or 30 days if marked as spam.</li>
        <li>Onboarding files: deleted 90 days after a project is archived.</li>
        <li>Security logs: 24 hours.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        You can ask to access, correct or delete the personal information we hold about you, or
        withdraw consent to analytics at any time. Depending on where you live (for example under
        the GDPR or the CCPA), you may have additional rights. To make a request, email{" "}
        <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or{" "}
        <Link href="/contact">contact us</Link>.
      </p>

      <h2>Security</h2>
      <p>
        Data is encrypted in transit, files are stored privately and only our staff can access
        submissions. No system is perfectly secure, but we take reasonable measures to protect your
        information.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. The date at the top shows when it last changed.
      </p>
    </LegalPage>
  );
}

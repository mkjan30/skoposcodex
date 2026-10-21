import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply when you use the ${site.name} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="October 21, 2026">
      <p>
        These terms apply to your use of this website, operated by {site.legalName}. By using the
        site you agree to them. Services we provide to clients are governed by a separate written
        agreement.
      </p>

      <h2>Use of the website</h2>
      <p>
        You may use this site to learn about our services and contact us. You agree not to misuse
        it, including by attempting to disrupt it, submit spam or access areas you are not
        authorised to use.
      </p>

      <h2>Information you submit</h2>
      <p>
        You are responsible for the accuracy of information you send us and confirm you have the
        right to share any files you upload. Do not submit passwords or other credentials. We handle
        what you send as described in our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Results and examples</h2>
      <p>
        Figures, case studies and testimonials on this site describe past or typical outcomes.
        Marketing results depend on many factors outside our control, so they are not a promise or
        guarantee of results for your business.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The content, design and branding on this site belong to {site.legalName} unless stated
        otherwise. You may not copy or reuse them without our permission.
      </p>

      <h2>Third-party links</h2>
      <p>We are not responsible for the content or practices of websites we link to.</p>

      <h2>Limitation of liability</h2>
      <p>
        The site is provided &ldquo;as is&rdquo;. To the extent permitted by law, we are not liable
        for any indirect or consequential loss arising from your use of it.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. Continued use of the site after changes means you accept them.
        Questions? <Link href="/contact">Contact us</Link>.
      </p>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import {
  CalendarCheck,
  Clock,
  LockOpen,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { SectionHeader } from "@/components/sections/section-header";
import { site } from "@/content/site";
import { serviceFromSlug } from "@/lib/contact-services";

export const metadata: Metadata = {
  title: "Contact Us: Book a Free Strategy Call",
  description:
    "Tell us about your business and goals. A senior strategist will reply within 24 hours to book your free 30-minute strategy call. No commitment.",
  alternates: { canonical: "/contact" },
};

const expectations = [
  { icon: Zap, title: "Reply within 24 hours", text: "A senior strategist reads every message." },
  {
    icon: CalendarCheck,
    title: "Free strategy call",
    text: "30 minutes on your market and goals.",
  },
  { icon: ShieldCheck, title: "No commitment", text: "Walk away with a plan either way." },
  { icon: LockOpen, title: "Cancel anytime", text: "If we work together, it's month-to-month." },
];

const faqs = [
  {
    question: "How quickly will you get back to me?",
    answer: "Within 24 hours on business days, usually much sooner.",
  },
  {
    question: "What happens after I submit the form?",
    answer:
      "A strategist reviews your details, then emails you to book a free 30-minute call. We come prepared with first observations about your market.",
  },
  {
    question: "Is the strategy call really free?",
    answer: "Yes. There's no cost and no obligation — you'll leave with useful ideas either way.",
  },
  {
    question: "Do you work with businesses outside the US?",
    answer:
      "Yes. We work remotely with clients worldwide, as long as we can support your market and language.",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const c = site.contact;
  const details = [
    c.email && { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
    c.phone && {
      icon: Phone,
      label: "Phone",
      value: c.phone,
      href: `tel:${c.phone.replace(/[^\d+]/g, "")}`,
    },
    c.hours && { icon: Clock, label: "Hours", value: c.hours },
    c.location && { icon: MapPin, label: "Location", value: c.location },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <section className="container-page pt-16 sm:pt-24">
        <SectionHeader
          as="h1"
          eyebrow="Get in touch"
          title={
            <>
              Let&apos;s build your <span className="text-gradient">growth strategy.</span>
            </>
          }
          description="Tell us where you are and where you want to be. A senior strategist will reach out within 24 hours to book your free strategy call."
        />
      </section>

      <section className="container-page grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.6fr_1fr]">
        <div className="bg-card rounded-3xl border p-5 sm:p-10">
          <ContactForm defaultService={serviceFromSlug(service)} />
        </div>

        <aside className="space-y-8">
          {details.length > 0 && (
            <div className="bg-card rounded-2xl border p-6">
              <h2 className="text-lg font-semibold">Contact information</h2>
              <dl className="mt-5 space-y-4">
                {details.map((d) => (
                  <div key={d.label} className="flex gap-3">
                    <d.icon className="text-brand mt-0.5 size-5 shrink-0" aria-hidden />
                    <div>
                      <dt className="text-muted-foreground text-sm">{d.label}</dt>
                      <dd>
                        {d.href ? (
                          <a href={d.href} className="hover:text-brand">
                            {d.value}
                          </a>
                        ) : (
                          d.value
                        )}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="bg-card rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">What to expect</h2>
            <ul className="mt-5 space-y-5">
              {expectations.map((e) => (
                <li key={e.title} className="flex gap-3">
                  <span className="bg-brand/10 text-brand grid size-9 shrink-0 place-items-center rounded-lg">
                    <e.icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-medium">{e.title}</span>
                    <span className="text-muted-foreground text-sm">{e.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="container-page grid gap-12 py-12 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeader eyebrow="FAQ" title="Common questions" />
        <FaqAccordion items={faqs} />
      </section>
    </>
  );
}

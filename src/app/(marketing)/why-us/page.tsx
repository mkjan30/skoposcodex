import type { Metadata } from "next";

import { ComparisonTable } from "@/components/sections/comparison-table";
import { CtaBand } from "@/components/sections/cta-band";
import { PillarGrid } from "@/components/sections/pillar-grid";
import { Reveal } from "@/components/sections/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { StatCounter } from "@/components/sections/stat-counter";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { WhatYouGet } from "@/components/sections/what-you-get";
import { comparison, pillars, resultStats, testimonials } from "@/content/why-us";

export const metadata: Metadata = {
  title: "Why Choose Us: Outcomes, Not Activity",
  description:
    "Senior strategists, weekly reviews, revenue-focused reporting and no lock-in contracts. See how Skopos Codex differs from a typical marketing agency.",
  alternates: { canonical: "/why-us" },
};

export default function WhyUsPage() {
  return (
    <>
      <section className="container-page py-16 sm:py-24">
        <SectionHeader
          as="h1"
          eyebrow="Why choose us"
          title={
            <>
              Built for businesses that <span className="text-gradient">want to scale.</span>
            </>
          }
          description="We measure ourselves by your outcomes, not our activity. Every decision is tied to your revenue."
        />
      </section>

      <section className="border-y py-16 text-center sm:py-20">
        <div className="container-page font-heading space-y-2 text-2xl font-semibold sm:text-4xl">
          <p className="text-muted-foreground">Most agencies sell activity.</p>
          <p className="text-gradient text-3xl font-bold sm:text-5xl">We sell outcomes.</p>
        </div>
      </section>

      <section className="container-page py-20 sm:py-28">
        <SectionHeader eyebrow="Our edge" title="What sets us apart" />
        <PillarGrid pillars={pillars} className="mt-12 lg:grid-cols-3" />
      </section>

      <section className="container-page pb-20 sm:pb-28">
        <SectionHeader
          eyebrow="The difference"
          title="Skopos Codex vs the rest"
          align="center"
          className="mb-12"
        />
        <ComparisonTable {...comparison} />
      </section>

      <section className="border-y py-20 sm:py-24">
        <div className="container-page">
          <SectionHeader eyebrow="Results" title="Average client results" align="center" />
          <div className="mt-14 grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
            {resultStats.map((s) => (
              <StatCounter key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20 sm:py-28">
        <SectionHeader eyebrow="Client stories" title="What our clients say" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} index={i}>
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page">
        <WhatYouGet>
          <div className="mt-10 border-t pt-8">
            <h4 className="text-lg font-semibold">Work with senior strategists</h4>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              A direct line to the strategist running your account — no middlemen. Bi-weekly
              strategy calls and real-time dashboard access come standard.
            </p>
          </div>
        </WhatYouGet>
      </section>

      <CtaBand
        title="Ready to work with an agency that actually delivers?"
        description="Book a free strategy call. No sales pressure — just a custom growth plan for your business."
        primary={{ label: "Book a free strategy call", href: "/contact" }}
        secondary={{ label: "See our process", href: "/process" }}
      />
    </>
  );
}

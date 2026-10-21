import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComparisonTable } from "@/components/sections/comparison-table";
import { CtaBand } from "@/components/sections/cta-band";
import { DashboardCard } from "@/components/sections/dashboard-card";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { Reveal } from "@/components/sections/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import { ServiceCard } from "@/components/sections/service-card";
import { StatCounter } from "@/components/sections/stat-counter";
import { StepCard } from "@/components/sections/step-card";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { IndustriesMarquee } from "@/components/sections/industries-marquee";
import { services } from "@/content/site";

export const metadata: Metadata = { title: "Section preview", robots: { index: false } };

// Dev-only catalogue of every section with sample content (Implementation Plan, Phase 2).
export default function SectionsPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="space-y-24 pb-12">
      <section className="container-page grid items-center gap-12 pt-16 lg:grid-cols-2">
        <SectionHeader
          as="h1"
          eyebrow="SectionHeader · h1"
          title={
            <>
              Where strategy meets <span className="text-gradient">digital growth.</span>
            </>
          }
          description="Sample hero copy rendered by SectionHeader with as='h1'."
        />
        <DashboardCard
          kpis={[
            { label: "Organic traffic", value: "+327%", delta: "vs last year" },
            { label: "Calls this month", value: "1,284", delta: "+18%" },
            { label: "Map pack rank", value: "#1", delta: "+4 spots" },
            { label: "Avg. review", value: "4.9", delta: "212 reviews" },
          ]}
          keywords={[
            { keyword: "plumber near me", rank: 1, change: 8 },
            { keyword: "emergency plumbing", rank: 2, change: 11 },
            { keyword: "water heater repair", rank: 1, change: 5 },
          ]}
        />
      </section>

      <IndustriesMarquee
        items={[
          "Home Services",
          "HVAC & Plumbing",
          "Healthcare & Dental",
          "Legal",
          "Real Estate",
          "E-Commerce",
          "Professional Services",
        ]}
      />

      <section className="container-page space-y-12">
        <SectionHeader
          eyebrow="ServiceCard"
          title="Five services. One growth system."
          align="center"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} index={i}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page space-y-12">
        <SectionHeader eyebrow="StepCard" title="Five steps. One repeatable system." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Analyze",
              tagline: "We find what others miss.",
              description: "Audit your presence, study competitors and map the growth levers.",
              deliverables: ["Competitor gap analysis", "Keyword opportunity map"],
              timeline: "1–2 weeks",
            },
            {
              title: "Strategize",
              tagline: "A plan built for your goals.",
              description: "Turn findings into a prioritised roadmap with clear milestones.",
              deliverables: ["Growth roadmap", "KPI framework"],
              timeline: "1 week",
            },
            {
              title: "Build",
              tagline: "Execution without excuses.",
              description: "Launch the campaigns, pages and tracking defined in the roadmap.",
              deliverables: ["Campaign setup", "Landing pages", "Analytics"],
              timeline: "2–4 weeks",
            },
          ].map((step, i) => (
            <Reveal key={step.title} index={i}>
              <StepCard step={step} number={i + 1} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page space-y-12">
        <SectionHeader eyebrow="StatCounter" title="Average client results" align="center" />
        <div className="grid gap-10 text-center sm:grid-cols-3">
          <StatCounter value={212} prefix="+" suffix="%" label="Average traffic growth" />
          <StatCounter value={3.4} suffix="x" decimals={1} label="Lead volume increase" />
          <StatCounter value={1284} label="Calls generated this month" />
        </div>
      </section>

      <section className="container-page space-y-12">
        <SectionHeader eyebrow="ComparisonTable" title="Us vs the typical agency" />
        <ComparisonTable
          themLabel="Typical agency"
          usLabel="Skopos Codex"
          rows={[
            { them: "Template strategies", us: "Custom strategy per market" },
            { them: "Junior account managers", us: "Senior-led team" },
            { them: "Vanity metric reports", us: "Revenue-focused reporting" },
            { them: "12-month lock-in", us: "Cancel anytime" },
          ]}
        />
      </section>

      <section className="container-page space-y-12">
        <SectionHeader eyebrow="TestimonialCard" title="Client stories" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <TestimonialCard
              key={n}
              t={{
                quote: "Placeholder testimonial. Replace with a real client quote before launch.",
                name: `Client ${n}`,
                role: "Owner",
                company: "Sample Co.",
              }}
            />
          ))}
        </div>
      </section>

      <section className="container-page grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeader eyebrow="FaqAccordion" title="Common questions" />
        <FaqAccordion
          items={[
            {
              question: "How long before we see results?",
              answer:
                "Most clients see early movement in 4–8 weeks and compounding results by month 4–6.",
            },
            {
              question: "Do you lock us into a contract?",
              answer: "No. Every engagement is month-to-month and you can cancel anytime.",
            },
            {
              question: "Will I have a dedicated point of contact?",
              answer: "Yes — a senior strategist owns your account and runs weekly check-ins.",
            },
          ]}
        />
      </section>

      <CtaBand
        title="Let's make your competitors nervous."
        description="Book a free 30-minute strategy call and leave with a clear growth plan."
        primary={{ label: "Book a free strategy call", href: "/contact" }}
        secondary={{ label: "See our process", href: "/process" }}
        points={["Free audit", "Competitor analysis", "Custom roadmap"]}
      />
    </div>
  );
}

import type { LucideIcon } from "lucide-react";

import type { PortfolioProject } from "@/content/portfolio";

import type { Faq } from "@/components/sections/faq-accordion";
import type { Step } from "@/components/sections/step-card";
import type { Stat } from "@/lib/format-stat";

/** Everything one /services/[slug] page renders, top to bottom (PRD §6.3). */
export type ServiceContent = {
  slug: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    /** H1; `highlight` is the trailing phrase rendered in the brand gradient. */
    title: string;
    highlight: string;
    description: string;
  };
  outcomes: { icon: LucideIcon; title: string; description: string }[]; // 3
  deliverables: {
    intro: string;
    /** Single source of truth for "how long" (fixes the reference's 4–6 vs 3–6 months mismatch). */
    timeline: string;
    items: { title: string; description: string }[]; // 6
  };
  framework: { title: string; steps: Step[] }; // 5 steps
  stats: (Stat & { label: string })[]; // 3 — TODO(launch): replace with real client averages
  caseStudy: { industry: string; result: string; summary: string }; // TODO(launch): real case study
  faqs: Faq[]; // 6
  cta: { title: string; description: string; points: string[] }; // 3 points
  /** Optional "Recent work" showcase, shown after the outcomes. */
  portfolio?: PortfolioProject[];
};

import { ChartColumn, Eye, LockOpen, Rocket, Sprout, Target, type LucideIcon } from "lucide-react";

import type { Testimonial } from "@/components/sections/testimonial-card";
import type { Stat } from "@/lib/format-stat";

export type Pillar = { icon: LucideIcon; title: string; description: string };

// The first four also appear on the home page.
export const pillars: Pillar[] = [
  {
    icon: ChartColumn,
    title: "Data-driven execution",
    description: "Decisions come from your analytics, not hunches. We test before we scale.",
  },
  {
    icon: Eye,
    title: "Transparent reporting",
    description: "See exactly where every dollar went and what it produced, every month.",
  },
  {
    icon: Target,
    title: "Conversion first",
    description: "Traffic is a means. We optimise for calls, leads and revenue.",
  },
  {
    icon: Sprout,
    title: "Long-term growth",
    description: "We build assets and systems that keep paying off after the campaign ends.",
  },
  {
    icon: Rocket,
    title: "Fast execution",
    description: "Onboarding in days and campaigns live in weeks, not quarters.",
  },
  {
    icon: LockOpen,
    title: "No lock-in contracts",
    description: "Month-to-month. Clients stay because it works, not because they have to.",
  },
];

export const comparison = {
  themLabel: "Typical agency",
  usLabel: "Skopos Codex",
  rows: [
    { them: "Template strategies", us: "Custom strategy for your market" },
    { them: "Junior account managers", us: "Senior strategists on every account" },
    { them: "Check-ins every other month", us: "Weekly performance reviews" },
    { them: "Vanity-metric reports", us: "Revenue-focused reporting" },
    { them: "12-month lock-in contracts", us: "Month-to-month, cancel anytime" },
    { them: "Outsourced execution", us: "In-house team" },
  ],
};

// TODO(launch): replace with real client averages.
export const resultStats: (Stat & { label: string })[] = [
  { value: 212, prefix: "+", suffix: "%", label: "Average traffic growth" },
  { value: 3.4, suffix: "x", decimals: 1, label: "Lead volume increase" },
  { value: 2.8, suffix: "x", decimals: 1, label: "Return on ad spend" },
  { value: 97, suffix: "%", label: "Client retention rate" },
];

// TODO(launch): replace with real, attributable client testimonials (with permission).
export const testimonials: Testimonial[] = [
  {
    quote:
      "We went from page three to the top three for our main service keywords. Weekly calls roughly quadrupled within five months.",
    name: "J. M.",
    role: "Owner",
    company: "HVAC company",
  },
  {
    quote:
      "For the first time we can see where every ad dollar goes. Our cost per lead dropped by more than half.",
    name: "S. K.",
    role: "Marketing Director",
    company: "Dental group",
  },
  {
    quote:
      "Two agencies before couldn't explain what they did. These guys showed us everything from day one.",
    name: "D. R.",
    role: "Managing Partner",
    company: "Law firm",
  },
];

export const whatYouGet = [
  "Full-service in-house team",
  "Dedicated senior strategist",
  "Weekly check-ins",
  "Strategy built for your market",
  "Live reporting dashboard",
  "Quarterly growth planning",
  "Experience across 10+ industries",
  "Cancel anytime — no lock-in",
];

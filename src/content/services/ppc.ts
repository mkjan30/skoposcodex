import { BadgeDollarSign, MousePointerClick, Target } from "lucide-react";

import type { ServiceContent } from "./types";

export const ppc: ServiceContent = {
  slug: "ppc",
  meta: {
    title: "PPC Management for Google Ads and Paid Social",
    description:
      "PPC management built around cost per lead, not clicks. Google Ads, Local Services Ads, and Meta campaigns tracked to real calls, forms, and booked jobs.",
  },
  hero: {
    eyebrow: "PPC Management",
    title: "Paid ads that",
    highlight: "pay for themselves.",
    description:
      "We run Google and Meta campaigns tied to calls, forms, and booked jobs. Every dollar is tracked, and every month you know what it returned.",
  },
  outcomes: [
    {
      icon: Target,
      title: "Reach buyers, not browsers",
      description:
        "Tight targeting and negative keywords keep your budget on people ready to hire.",
    },
    {
      icon: BadgeDollarSign,
      title: "Lower cost per lead",
      description:
        "Constant testing of ads, bids, and landing pages pushes down what each lead costs you.",
    },
    {
      icon: MousePointerClick,
      title: "Clicks that convert",
      description: "Landing pages built for one job: turning ad traffic into calls and form fills.",
    },
  ],
  deliverables: {
    intro:
      "Full campaign management from account setup to monthly optimization, with tracking you can trust.",
    timeline: "Campaigns live in 2–3 weeks",
    items: [
      {
        title: "Account audit and restructure",
        description:
          "We find wasted spend in your current account and rebuild it around what converts.",
      },
      {
        title: "Keyword and audience research",
        description:
          "The search terms and audiences most likely to become paying customers in your area.",
      },
      {
        title: "Ad copy and creative",
        description:
          "Search ads, display, and social creative written and tested to earn the click.",
      },
      {
        title: "Conversion tracking",
        description:
          "Call tracking, form tracking, and offline conversions so the platforms optimize for real leads.",
      },
      {
        title: "Landing page optimization",
        description:
          "Focused pages with one offer and one action, tested to raise conversion rate.",
      },
      {
        title: "Budget and bid management",
        description:
          "Daily monitoring and weekly adjustments so spend follows the campaigns that perform.",
      },
    ],
  },
  framework: {
    title: "How we run your campaigns",
    steps: [
      {
        title: "Audit",
        tagline: "Find the waste.",
        description:
          "We review your account, search terms, and tracking to see where money leaks out.",
        deliverables: ["Spend waste report", "Tracking gap review", "Competitor ad review"],
        timeline: "Week 1",
      },
      {
        title: "Tracking",
        tagline: "Measure what matters.",
        description:
          "We set up call, form, and offline conversion tracking before spending another dollar.",
        deliverables: ["Conversion tracking setup", "Call tracking numbers", "Reporting dashboard"],
        timeline: "Week 1–2",
      },
      {
        title: "Build",
        tagline: "Launch with structure.",
        description:
          "We build campaigns, ads, and landing pages around your most profitable services.",
        deliverables: [
          "Campaign structure",
          "Ad copy and creative",
          "Landing pages",
          "Negative keyword lists",
        ],
        timeline: "Week 2–3",
      },
      {
        title: "Optimize",
        tagline: "Cut what doesn't work.",
        description:
          "We review search terms, bids, and ads every week and shift budget toward what converts.",
        deliverables: ["Weekly search term review", "A/B ad tests", "Bid adjustments"],
        timeline: "Month 1–3",
      },
      {
        title: "Scale",
        tagline: "Grow what does.",
        description:
          "Once cost per lead is stable, we expand to new services, areas, and channels.",
        deliverables: ["Budget scaling plan", "New channel tests", "Monthly performance review"],
        timeline: "Month 3 onward",
      },
    ],
  },
  // TODO(launch): replace with real client averages
  stats: [
    { value: 34, prefix: "-", suffix: "%", label: "Average drop in cost per lead" },
    { value: 3.6, decimals: 1, suffix: "x", label: "Average return on ad spend" },
    { value: 58, prefix: "+", suffix: "%", label: "Average increase in conversion rate" },
  ],
  // TODO(launch): replace with a real case study
  caseStudy: {
    industry: "Plumbing company, Phoenix metro",
    result: "38% lower cost per lead in 90 days",
    summary:
      "Their Google Ads account was spending heavily on broad terms with no call tracking. We rebuilt the campaigns around emergency and drain services, added call tracking, and paused the keywords that never produced a job.",
  },
  faqs: [
    {
      question: "How fast can campaigns go live?",
      answer:
        "Most campaigns are live within 2–3 weeks, once tracking and landing pages are in place. Expect another 4–8 weeks of testing before cost per lead settles.",
    },
    {
      question: "Can you guarantee a number of leads?",
      answer:
        "No. Results depend on your market, budget, and offer. We commit to transparent tracking and steady optimization, and we show you exactly where every dollar goes.",
    },
    {
      question: "How is your fee set?",
      answer:
        "Our management fee is a flat monthly rate based on ad spend and the number of channels. Your ad budget is paid directly to Google or Meta, never marked up.",
    },
    {
      question: "What do you need from me?",
      answer:
        "Admin access to your ad accounts and website, your average job value, and quick feedback on lead quality. That feedback is what lets us cut bad leads.",
    },
    {
      question: "I already have an agency. Can you take over the account?",
      answer:
        "Yes. We take over existing accounts and keep their history, which helps the platforms optimize. We handle the transition so campaigns keep running.",
    },
    {
      question: "Is there a long-term contract?",
      answer:
        "No. We work month to month and you can cancel anytime. Your ad accounts stay in your name, so you keep all data and campaigns.",
    },
  ],
  cta: {
    title: "See where your ad budget is leaking.",
    description:
      "Get a free PPC audit. We will show you wasted spend, missing tracking, and the fastest ways to lower your cost per lead.",
    points: ["Free account audit", "No markup on ad spend", "Month-to-month, cancel anytime"],
  },
};

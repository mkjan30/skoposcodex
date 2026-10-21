import { Palette, ShieldCheck, Sparkles } from "lucide-react";

import type { ServiceContent } from "./types";

export const branding: ServiceContent = {
  slug: "branding",
  meta: {
    title: "Branding and Brand Identity for Growing Businesses",
    description:
      "Brand strategy, logo, and visual identity for businesses ready to look as good as the work they do. Clear positioning and a system your team can use.",
  },
  hero: {
    eyebrow: "Branding",
    title: "A brand people",
    highlight: "remember and trust.",
    description:
      "We define what makes you different, then build the logo, voice, and visual system that make it obvious at a glance.",
  },
  outcomes: [
    {
      icon: Sparkles,
      title: "Stand out from look-alikes",
      description:
        "Clear positioning that gives customers a reason to choose you over the next search result.",
    },
    {
      icon: ShieldCheck,
      title: "Earn trust faster",
      description:
        "A professional, consistent look that makes you feel established from the first impression.",
    },
    {
      icon: Palette,
      title: "Consistent everywhere",
      description:
        "One system for your site, trucks, ads, and social, so every touchpoint looks like you.",
    },
  ],
  deliverables: {
    intro: "Strategy first, then design. You leave with a brand and the tools to use it correctly.",
    timeline: "Brand system delivered in 6–8 weeks",
    items: [
      {
        title: "Brand strategy and positioning",
        description: "Who you serve, what you promise, and why customers should believe you.",
      },
      {
        title: "Messaging and voice",
        description:
          "A tagline, key messages, and voice rules so everyone describes you the same way.",
      },
      {
        title: "Logo design",
        description:
          "A primary logo with alternate versions that work on a website, a sign, or a shirt.",
      },
      {
        title: "Color and typography",
        description:
          "A palette and type system that is distinctive, accessible, and easy to reuse.",
      },
      {
        title: "Brand guidelines",
        description: "A clear guide that shows your team and vendors how to apply the brand.",
      },
      {
        title: "Launch assets",
        description:
          "Business cards, social profiles, email signatures, and templates ready to use.",
      },
    ],
  },
  framework: {
    title: "How we build your brand",
    steps: [
      {
        title: "Discover",
        tagline: "Learn the business.",
        description:
          "We interview you, review competitors, and talk to customers to see how you are perceived.",
        deliverables: ["Stakeholder workshop", "Competitor review", "Customer insights summary"],
        timeline: "Week 1–2",
      },
      {
        title: "Position",
        tagline: "Decide what you stand for.",
        description:
          "We define your audience, promise, and personality, and agree on them before any design starts.",
        deliverables: ["Positioning statement", "Messaging framework", "Voice guidelines"],
        timeline: "Week 2–3",
      },
      {
        title: "Design",
        tagline: "Make it visible.",
        description: "We present logo and identity directions, then refine the one that fits best.",
        deliverables: ["Logo concepts", "Color palette", "Typography system"],
        timeline: "Week 3–5",
      },
      {
        title: "Refine",
        tagline: "Test it in the real world.",
        description:
          "We apply the identity to real assets to make sure it holds up everywhere you use it.",
        deliverables: ["Applied mockups", "Two revision rounds", "Final logo files"],
        timeline: "Week 5–6",
      },
      {
        title: "Launch",
        tagline: "Hand it over ready to use.",
        description:
          "We deliver guidelines, templates, and every file format you need to roll it out.",
        deliverables: ["Brand guidelines", "Launch asset kit", "Source files", "Rollout checklist"],
        timeline: "Week 7–8",
      },
    ],
  },
  // TODO(launch): replace with real client averages
  stats: [
    {
      value: 27,
      prefix: "+",
      suffix: "%",
      label: "Average lift in website conversion after rebrand",
    },
    { value: 41, prefix: "+", suffix: "%", label: "Average increase in branded search" },
    { value: 7, suffix: " wks", label: "Average time from kickoff to launch" },
  ],
  // TODO(launch): replace with a real case study
  caseStudy: {
    industry: "Family dental practice, Charlotte",
    result: "35% more new-patient bookings after rebrand",
    summary:
      "The practice had outgrown a dated logo and a look that matched every other dentist in town. We repositioned it around family care, built a warm new identity, and rolled it out across the site, signage, and patient forms.",
  },
  faqs: [
    {
      question: "How long does a brand project take?",
      answer:
        "Most projects are delivered in 6–8 weeks. Timing depends mainly on how quickly we get feedback at each review.",
    },
    {
      question: "What if I don't like the designs?",
      answer:
        "We agree on strategy before design starts, which keeps surprises rare. Every project includes two rounds of revisions on the chosen direction.",
    },
    {
      question: "How do you price branding?",
      answer:
        "Branding is a fixed-price project based on scope, such as whether you need naming, messaging, or a full asset kit. You get a written quote before we start.",
    },
    {
      question: "What do you need from me?",
      answer:
        "A kickoff workshop, access to a few customers or reviews, and one decision-maker who can give feedback within a few days at each stage.",
    },
    {
      question: "Can you refresh my brand instead of starting over?",
      answer:
        "Yes. If your name and logo have real recognition, we can modernize them and build a clearer system around what already works.",
    },
    {
      question: "Do I own the final brand?",
      answer:
        "Yes. Once the project is paid, you own the logo, files, and guidelines outright. There is no retainer or ongoing contract required.",
    },
  ],
  cta: {
    title: "Ready to look as good as your work?",
    description:
      "Book a free brand review. We will look at how you show up today and where a sharper brand would make the biggest difference.",
    points: ["Free brand review", "Fixed project price", "You own every file"],
  },
};

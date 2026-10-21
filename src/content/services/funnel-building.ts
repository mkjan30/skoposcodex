import { Mail, Users, Workflow } from "lucide-react";

import type { ServiceContent } from "./types";

export const funnelBuilding: ServiceContent = {
  slug: "funnel-building",
  meta: {
    title: "Sales Funnel Building and Lead Nurture Automation",
    description:
      "Sales funnels that capture, qualify, and follow up with every lead. Landing pages, offers, email and SMS automation, and CRM setup built to book more calls.",
  },
  hero: {
    eyebrow: "Funnel Building",
    title: "Funnels that turn",
    highlight: "leads into revenue.",
    description:
      "Most leads go cold because nobody follows up in time. We build the pages, offers, and automations that capture interest and move people to a sale.",
  },
  outcomes: [
    {
      icon: Users,
      title: "Capture more leads",
      description:
        "Focused landing pages and offers that give visitors a reason to raise their hand.",
    },
    {
      icon: Mail,
      title: "Follow up automatically",
      description:
        "Email and SMS sequences that respond in minutes and keep nurturing until leads are ready.",
    },
    {
      icon: Workflow,
      title: "A pipeline you can see",
      description:
        "Every lead tracked in your CRM, so you know where each one stands and what it is worth.",
    },
  ],
  deliverables: {
    intro:
      "A complete path from first click to booked call, built in the tools you already use where possible.",
    timeline: "Funnel live in 3–5 weeks",
    items: [
      {
        title: "Funnel strategy and mapping",
        description:
          "A clear map of each step from first visit to sale, and where leads drop off today.",
      },
      {
        title: "Offer and lead magnet",
        description:
          "A free quote, guide, or consult offer that is worth trading contact details for.",
      },
      {
        title: "Landing and thank-you pages",
        description: "Pages with one goal each, written and designed to convert.",
      },
      {
        title: "Email and SMS automation",
        description:
          "Follow-up sequences that answer questions, handle objections, and ask for the next step.",
      },
      {
        title: "CRM and pipeline setup",
        description:
          "Lead stages, tags, and notifications so your team knows who to call and when.",
      },
      {
        title: "Testing and reporting",
        description:
          "Conversion tracking at every step, with tests that improve the weakest link first.",
      },
    ],
  },
  framework: {
    title: "How we build your funnel",
    steps: [
      {
        title: "Map",
        tagline: "See where leads leak.",
        description:
          "We trace how leads find you today and where they stall, from first click to closed deal.",
        deliverables: ["Current funnel audit", "Drop-off analysis", "Funnel blueprint"],
        timeline: "Week 1",
      },
      {
        title: "Offer",
        tagline: "Give them a reason to act.",
        description: "We shape an offer your ideal customer wants and write the message around it.",
        deliverables: ["Offer definition", "Lead magnet or consult offer", "Core messaging"],
        timeline: "Week 1–2",
      },
      {
        title: "Build",
        tagline: "Pages that do one job.",
        description:
          "We design and build landing pages, forms, and booking flows connected to your CRM.",
        deliverables: [
          "Landing page",
          "Thank-you page",
          "Booking or quote form",
          "CRM integration",
        ],
        timeline: "Week 2–4",
      },
      {
        title: "Automate",
        tagline: "Follow up without lifting a finger.",
        description: "We write and set up email and SMS sequences that keep every lead warm.",
        deliverables: ["Email sequence", "SMS follow-ups", "Team notifications"],
        timeline: "Week 3–5",
      },
      {
        title: "Optimize",
        tagline: "Improve the weakest step.",
        description:
          "Once traffic is flowing, we test headlines, offers, and timing to lift conversion.",
        deliverables: ["Step-by-step tracking", "A/B tests", "Monthly funnel report"],
        timeline: "Month 2 onward",
      },
    ],
  },
  // TODO(launch): replace with real client averages
  stats: [
    { value: 46, prefix: "+", suffix: "%", label: "Average increase in booked calls" },
    { value: 5, prefix: "<", suffix: " min", label: "Average lead response time" },
    { value: 22, prefix: "+", suffix: "%", label: "Average lift in lead-to-sale rate" },
  ],
  // TODO(launch): replace with a real case study
  caseStudy: {
    industry: "Home remodeling contractor, Atlanta",
    result: "41% more booked consultations in 60 days",
    summary:
      "Leads from their ads sat in an inbox for a day or more before anyone called back. We built a consult landing page, instant SMS and email follow-up, and a simple pipeline so the sales team called every lead the same day.",
  },
  faqs: [
    {
      question: "How long does it take to build a funnel?",
      answer:
        "Most funnels go live in 3–5 weeks. We then spend the following months testing and improving each step.",
    },
    {
      question: "Can you guarantee more sales?",
      answer:
        "No. Sales depend on your offer, pricing, and team. We build the system, track every step, and keep improving the parts that underperform.",
    },
    {
      question: "How do you price funnel projects?",
      answer:
        "The build is a fixed-price project based on the number of pages, sequences, and integrations. Ongoing optimization is a separate flat monthly fee.",
    },
    {
      question: "What do you need from me?",
      answer:
        "Access to your website, CRM, and email tools, details about your best customers, and someone on your team to answer the leads we send.",
    },
    {
      question: "Do I need new software?",
      answer:
        "Usually not. We build in the CRM and email tools you already use when they can do the job, and recommend changes only when they can't.",
    },
    {
      question: "Is there a long-term contract?",
      answer:
        "No. Ongoing optimization is month to month and you can cancel anytime. You keep every page, sequence, and contact we build.",
    },
  ],
  cta: {
    title: "Stop letting good leads go cold.",
    description:
      "Book a free funnel review. We will map where leads drop off today and show you the fastest fixes.",
    points: [
      "Free funnel review",
      "Built in your existing tools",
      "Month-to-month, cancel anytime",
    ],
  },
};

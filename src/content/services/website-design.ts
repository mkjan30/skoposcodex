import { Gauge, LayoutTemplate, Smartphone } from "lucide-react";

import { portfolio } from "@/content/portfolio";

import type { ServiceContent } from "./types";

export const websiteDesign: ServiceContent = {
  slug: "website-design",
  meta: {
    title: "Website Design That Turns Visitors Into Leads",
    description:
      "Fast, mobile-first websites built to rank and convert. Custom design, clear copy, and SEO foundations for local and growth-stage businesses, start to launch.",
  },
  hero: {
    eyebrow: "Website Design",
    title: "Websites built to",
    highlight: "win you business.",
    description:
      "Your website should bring in leads, not just look nice. We design fast, clear sites that rank in search and make it easy to get in touch.",
  },
  outcomes: [
    {
      icon: LayoutTemplate,
      title: "Built to convert",
      description:
        "Clear pages, strong calls to action, and simple forms that turn visitors into leads.",
    },
    {
      icon: Gauge,
      title: "Fast on every connection",
      description:
        "Lean code and optimized images keep load times low and Core Web Vitals in the green.",
    },
    {
      icon: Smartphone,
      title: "Mobile first",
      description:
        "Most local customers find you on a phone. Your site is designed for that screen first.",
    },
  ],
  deliverables: {
    intro:
      "A complete website from strategy to launch, with the foundations to grow traffic after it goes live.",
    timeline: "Launch in 6–10 weeks",
    items: [
      {
        title: "Sitemap and page strategy",
        description:
          "A page structure based on your services, locations, and what customers search for.",
      },
      {
        title: "Custom design",
        description: "A design built around your brand and your buyers, not a stock template.",
      },
      {
        title: "Conversion copywriting",
        description: "Clear, specific copy that explains what you do and why to choose you.",
      },
      {
        title: "Responsive development",
        description: "A fast, accessible site that works on every screen size and browser.",
      },
      {
        title: "SEO foundations",
        description:
          "Clean URLs, metadata, schema, and redirects so you keep and grow your rankings.",
      },
      {
        title: "Analytics and lead tracking",
        description: "Analytics, call tracking, and form tracking set up before launch day.",
      },
    ],
  },
  framework: {
    title: "How we build your website",
    steps: [
      {
        title: "Plan",
        tagline: "Start with the goal.",
        description:
          "We define who the site is for, what it must do, and how we will measure success.",
        deliverables: ["Goals and KPIs", "Sitemap", "Content plan"],
        timeline: "Week 1–2",
      },
      {
        title: "Write",
        tagline: "Words before pixels.",
        description:
          "We draft the copy for key pages so the design is built around a clear message.",
        deliverables: ["Homepage copy", "Service page copy", "Calls to action"],
        timeline: "Week 2–4",
      },
      {
        title: "Design",
        tagline: "Make it clear and credible.",
        description:
          "We design the key pages, review them with you, and refine until they are right.",
        deliverables: ["Wireframes", "Page designs", "Two revision rounds"],
        timeline: "Week 3–6",
      },
      {
        title: "Build",
        tagline: "Fast, accessible, and solid.",
        description:
          "We develop the site, connect forms and tracking, and test it on real devices.",
        deliverables: [
          "Responsive build",
          "Form and tracking setup",
          "Speed optimization",
          "Accessibility checks",
        ],
        timeline: "Week 5–9",
      },
      {
        title: "Launch",
        tagline: "Go live without losing ground.",
        description:
          "We handle redirects, launch checks, and the first weeks of monitoring after go-live.",
        deliverables: ["Redirect map", "Launch checklist", "30-day post-launch support"],
        timeline: "Week 8–10",
      },
    ],
  },
  // TODO(launch): replace with real client averages
  stats: [
    { value: 52, prefix: "+", suffix: "%", label: "Average increase in leads after relaunch" },
    { value: 1.8, decimals: 1, suffix: "s", label: "Average mobile load time" },
    { value: 94, label: "Average Lighthouse performance score" },
  ],
  // TODO(launch): replace with a real case study
  caseStudy: {
    industry: "Landscaping company, Denver",
    result: "2x more quote requests in the first quarter after launch",
    summary:
      "Their old site was slow on mobile and buried the quote form three clicks deep. We rebuilt it with service and area pages, a quote form on every page, and redirects that kept their existing rankings intact.",
  },
  faqs: [
    {
      question: "How long does a new website take?",
      answer:
        "Most sites launch in 6–10 weeks. Larger sites with many locations or integrations sit at the longer end of that range.",
    },
    {
      question: "Will I lose my Google rankings?",
      answer:
        "We map every old URL to its new page and handle redirects so you keep the rankings you have earned. We cannot promise rankings, but we protect what you already have.",
    },
    {
      question: "How do you price websites?",
      answer:
        "Websites are fixed-price projects based on the number of pages, features, and integrations. You get a written quote after a short discovery call.",
    },
    {
      question: "What do you need from me?",
      answer:
        "Your logo, photos if you have them, access to your domain and hosting, and timely feedback at each review. We write the copy with you.",
    },
    {
      question: "Can I edit the site myself after launch?",
      answer:
        "Yes. We build on an editor you can use without code and show you how to update pages, images, and posts.",
    },
    {
      question: "Do I have to sign an ongoing contract?",
      answer:
        "No. The build is a one-time project and you own the site. Ongoing care and updates are optional, month to month, and you can cancel anytime.",
    },
  ],
  cta: {
    title: "Is your website costing you leads?",
    description:
      "Get a free website review. We will check speed, mobile experience, and conversion paths, and show you what to fix first.",
    points: ["Free website review", "Fixed project price", "You own the site"],
  },
  portfolio,
};

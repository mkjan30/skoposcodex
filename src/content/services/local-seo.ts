import { MapPin, PhoneCall, TrendingUp } from "lucide-react";

import type { ServiceContent } from "./types";

export const localSeo: ServiceContent = {
  slug: "local-seo",
  meta: {
    title: "Local SEO Services for Service-Area Businesses",
    description:
      "Local SEO that puts you in the map pack and on page one. Google Business Profile, location pages, citations, and reviews, managed month to month.",
  },
  hero: {
    eyebrow: "Local SEO",
    title: "Local SEO that",
    highlight: "owns your market.",
    description:
      "When someone nearby searches for what you do, you should be the first name they see. We build the profile, pages, and reputation that get you there.",
  },
  outcomes: [
    {
      icon: MapPin,
      title: "Show up in the map pack",
      description:
        "A fully optimized Google Business Profile that ranks for the searches your customers actually make.",
    },
    {
      icon: PhoneCall,
      title: "More calls, not just clicks",
      description:
        "We track calls, direction requests, and form fills, so you see leads instead of vanity metrics.",
    },
    {
      icon: TrendingUp,
      title: "Growth that compounds",
      description:
        "Rankings built on solid foundations keep paying off long after the work is done.",
    },
  ],
  deliverables: {
    intro:
      "Everything a local business needs to rank in its service area, handled by one team and reported in plain English.",
    timeline: "First results in 60–90 days",
    items: [
      {
        title: "Google Business Profile optimization",
        description:
          "Categories, services, photos, posts, and Q&A tuned to match how customers search.",
      },
      {
        title: "Local keyword mapping",
        description:
          "Every service and city you care about, mapped to the page that should rank for it.",
      },
      {
        title: "Location and service pages",
        description:
          "Pages built for each area you serve, with real local detail instead of copy-paste filler.",
      },
      {
        title: "NAP and citation cleanup",
        description:
          "Your name, address, and phone number consistent across the directories Google trusts.",
      },
      {
        title: "Review generation and response",
        description:
          "A simple system to ask happy customers for reviews, plus timely replies to every one.",
      },
      {
        title: "Local authority and links",
        description:
          "Links from local news, partners, and community sites that signal you belong in this market.",
      },
    ],
  },
  framework: {
    title: "How we grow your local visibility",
    steps: [
      {
        title: "Audit",
        tagline: "Find out where you stand.",
        description:
          "We review your profile, site, citations, and reviews against the top three competitors in your area.",
        deliverables: [
          "Competitor gap report",
          "Citation and NAP audit",
          "Prioritized action list",
        ],
        timeline: "Week 1–2",
      },
      {
        title: "Foundation",
        tagline: "Fix what holds you back.",
        description:
          "We clean up listings, correct technical issues, and rebuild your Google Business Profile.",
        deliverables: [
          "GBP rebuild",
          "Citation corrections",
          "Technical SEO fixes",
          "Tracking setup",
        ],
        timeline: "Week 2–4",
      },
      {
        title: "Content",
        tagline: "Give Google a reason to rank you.",
        description:
          "We publish service and location pages that answer what local customers ask before they call.",
        deliverables: ["Keyword-to-page map", "Location pages", "Service page rewrites"],
        timeline: "Week 4–8",
      },
      {
        title: "Reputation",
        tagline: "Turn customers into proof.",
        description:
          "We set up review requests and reply to reviews so your rating and volume keep climbing.",
        deliverables: ["Review request flow", "Response templates", "Monthly review report"],
        timeline: "Week 6 onward",
      },
      {
        title: "Authority",
        tagline: "Build lasting strength.",
        description:
          "We earn local links and mentions, then report monthly on rankings, calls, and leads.",
        deliverables: [
          "Local link outreach",
          "Monthly ranking report",
          "Quarterly strategy review",
        ],
        timeline: "Month 3 onward",
      },
    ],
  },
  // TODO(launch): replace with real client averages
  stats: [
    { value: 148, prefix: "+", suffix: "%", label: "Average growth in map pack views" },
    { value: 63, prefix: "+", suffix: "%", label: "Average increase in calls from search" },
    { value: 4.8, decimals: 1, label: "Average Google rating after 6 months" },
  ],
  // TODO(launch): replace with a real case study
  caseStudy: {
    industry: "HVAC company, Dallas–Fort Worth",
    result: "2.1x more calls from Google in 6 months",
    summary:
      "Their profile was split across two duplicate listings and they ranked for almost nothing outside one zip code. We merged the listings, built pages for eight service areas, and set up review requests after every job.",
  },
  faqs: [
    {
      question: "How long until I see results?",
      answer:
        "Most clients see first movement in the map pack within 60–90 days. Competitive markets and brand-new businesses can take longer, and we will tell you up front if we expect that.",
    },
    {
      question: "Can you guarantee a #1 ranking?",
      answer:
        "No, and be wary of anyone who does. Google controls rankings. We control the work, and we report every month on what changed and why.",
    },
    {
      question: "How is pricing set?",
      answer:
        "Pricing depends on how many locations you have and how competitive your market is. After a short call and audit, we send a flat monthly quote with no hidden fees.",
    },
    {
      question: "What do you need from me?",
      answer:
        "Access to your Google Business Profile and website, a list of your services and service areas, and a 30-minute call each month. We handle the rest.",
    },
    {
      question: "Do you work with my existing web developer?",
      answer:
        "Yes. We can hand your developer clear change requests, or make the updates ourselves if you prefer.",
    },
    {
      question: "Am I locked into a long contract?",
      answer:
        "No. We work month to month and you can cancel anytime. You keep everything we build, including pages, listings, and reports.",
    },
  ],
  cta: {
    title: "Find out what's keeping you off the map.",
    description:
      "Book a free local visibility audit. We will show you where you rank, where competitors beat you, and what to fix first.",
    points: [
      "Free audit, no obligation",
      "Month-to-month, cancel anytime",
      "Plain-English reporting",
    ],
  },
};

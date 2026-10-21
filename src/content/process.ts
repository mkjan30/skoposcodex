import type { Faq } from "@/components/sections/faq-accordion";
import type { Step } from "@/components/sections/step-card";

// Used by /process (full) and the home page process teaser (titles + taglines).
export const processSteps: Step[] = [
  {
    title: "Analyze",
    tagline: "Find what others miss.",
    description:
      "We audit your current presence, study the competitors winning your market and map the levers that will move revenue.",
    deliverables: [
      "Competitor audit and gap analysis",
      "Keyword and market opportunity map",
      "Performance baseline report",
      "Industry benchmarks",
    ],
    timeline: "1–2 weeks",
  },
  {
    title: "Strategize",
    tagline: "A plan built for your goals.",
    description:
      "Findings become a prioritised roadmap: which channels, what budget, which milestones, and how we will measure each one.",
    deliverables: [
      "Growth roadmap with milestones",
      "Channel mix and budget allocation",
      "KPI framework",
      "Messaging and positioning",
    ],
    timeline: "1 week",
  },
  {
    title: "Build",
    tagline: "Execution without excuses.",
    description:
      "We launch the campaigns, pages, funnels and tracking the roadmap calls for — built for speed and conversion from day one.",
    deliverables: [
      "Campaign setup",
      "Landing pages and funnels",
      "Analytics and call tracking",
      "Content and creative",
    ],
    timeline: "2–4 weeks",
  },
  {
    title: "Optimize",
    tagline: "Data in, better results out.",
    description:
      "Every week we review the numbers, find where performance leaks and run structured tests to close the gaps.",
    deliverables: [
      "Weekly performance reviews",
      "A/B tests and iterations",
      "Bid and budget optimisation",
      "Monthly insight reports",
    ],
    timeline: "Ongoing",
  },
  {
    title: "Scale",
    tagline: "Double down on what works.",
    description:
      "Once the system is proven, we push budget into the winners, open adjacent channels and automate what can be automated.",
    deliverables: [
      "New channel expansion",
      "Scaling playbook for winning campaigns",
      "Automation and retargeting",
      "Quarterly growth planning",
    ],
    timeline: "Ongoing",
  },
];

// TODO(launch): replace with the real retention figure.
export const retentionStat = { value: 97, suffix: "%", label: "client retention after 6 months" };

export const processFaqs: Faq[] = [
  {
    question: "How long before we see results?",
    answer:
      "Paid campaigns can produce leads within weeks of launch. SEO and organic work usually shows clear movement in 60–90 days and compounds from there.",
  },
  {
    question: "Do you work with businesses in any industry?",
    answer:
      "We focus on local and service businesses — home services, healthcare, legal, real estate, professional services — plus e-commerce brands ready to scale.",
  },
  {
    question: "What makes your process different?",
    answer:
      "Nothing is templated. Every engagement starts with analysis of your market, and every action we take is tied to a metric you can see.",
  },
  {
    question: "Will I have a dedicated point of contact?",
    answer:
      "Yes. A senior strategist owns your account, runs weekly check-ins and is reachable directly.",
  },
  {
    question: "How do you report on results?",
    answer:
      "You get a live dashboard plus a monthly report covering spend, leads, cost per lead and revenue impact — with what we are changing next and why.",
  },
];

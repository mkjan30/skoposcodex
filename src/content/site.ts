import {
  Funnel,
  MapPin,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  type LucideIcon,
} from "lucide-react";

export const site = {
  name: "Skopos Codex",
  legalName: "Skopos Codex LLC",
  tagline: "Where strategy meets digital growth.",
  description:
    "A digital marketing agency building high-performance growth systems — Local SEO, PPC, branding, website design and funnels — that turn traffic into leads and revenue.",
  // Server-side only. On Vercel, VERCEL_PROJECT_PRODUCTION_URL is the custom domain once attached.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  // Hidden in the footer until real profile URLs exist (PRD §7).
  socials: [] as { label: string; href: string }[],
  // TODO(launch): fill in real details; the contact page shows only the ones that are set.
  contact: {} as { email?: string; phone?: string; hours?: string; location?: string },
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  /** Short label shown as a pill on service cards. */
  tag: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    slug: "local-seo",
    tag: "Search visibility",
    title: "Local SEO",
    summary: "Own the map pack and local search in your service area.",
    icon: MapPin,
  },
  {
    slug: "ppc",
    tag: "Paid growth",
    title: "PPC Advertising",
    summary: "Paid campaigns tuned for cost per lead, not clicks.",
    icon: MousePointerClick,
  },
  {
    slug: "branding",
    tag: "Brand identity",
    title: "Branding",
    summary: "Identity and messaging that make you the obvious choice.",
    icon: Palette,
  },
  {
    slug: "website-design",
    tag: "Web design",
    title: "Website Design",
    summary: "Fast, conversion-first websites built to rank.",
    icon: MonitorSmartphone,
  },
  {
    slug: "funnel-building",
    tag: "Automation",
    title: "Funnel Building",
    summary: "Automated lead systems that capture and nurture.",
    icon: Funnel,
  },
];

export const mainNav = [
  { label: "Process", href: "/process" },
  { label: "Why Us", href: "/why-us" },
  { label: "Onboard", href: "/onboard" },
];

export const companyLinks = [
  { label: "Our Process", href: "/process" },
  { label: "Why Us", href: "/why-us" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

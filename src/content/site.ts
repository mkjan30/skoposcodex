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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Hidden in the footer until real profile URLs exist (PRD §7).
  socials: [] as { label: string; href: string }[],
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    slug: "local-seo",
    title: "Local SEO",
    summary: "Own the map pack and local search in your service area.",
    icon: MapPin,
  },
  {
    slug: "ppc",
    title: "PPC Advertising",
    summary: "Paid campaigns tuned for cost per lead, not clicks.",
    icon: MousePointerClick,
  },
  {
    slug: "branding",
    title: "Branding",
    summary: "Identity and messaging that make you the obvious choice.",
    icon: Palette,
  },
  {
    slug: "website-design",
    title: "Website Design",
    summary: "Fast, conversion-first websites built to rank.",
    icon: MonitorSmartphone,
  },
  {
    slug: "funnel-building",
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

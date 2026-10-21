import { MapPin, Phone, Star, TrendingUp } from "lucide-react";

export const home = {
  meta: {
    title: "Digital Marketing Agency for Local Businesses",
    description:
      "Skopos Codex builds marketing systems that turn traffic into leads and revenue: Local SEO, PPC, branding, website design and funnels for growing businesses.",
  },
  hero: {
    badge: "Digital growth agency",
    title: "Where strategy meets",
    highlight: "digital growth.",
    description:
      "We build marketing systems that drive traffic, leads and revenue — and show you exactly how they perform.",
  },
  // TODO(launch): sample dashboard figures; replace with a real (anonymised) client snapshot.
  dashboard: {
    kpis: [
      { icon: TrendingUp, label: "Organic traffic", value: "+327%", delta: "vs last year" },
      { icon: Phone, label: "Calls this month", value: "1,284", delta: "+18% MoM" },
      { icon: MapPin, label: "Map pack rank", value: "#1", delta: "+4 spots" },
      { icon: Star, label: "Avg. review", value: "4.9", delta: "212 reviews" },
    ],
    keywords: [
      { keyword: "plumber near me", rank: 1, change: 8 },
      { keyword: "emergency plumbing", rank: 2, change: 11 },
      { keyword: "water heater repair", rank: 1, change: 5 },
    ],
  },
  // Pinned scroll scenes under the hero.
  engine: ["We engineer growth.", "Every channel. One system.", "Built to compound."],
  noGuesswork: {
    lead: "We don't run random campaigns.",
    big: "No guesswork.",
    tail: "Just growth systems built for your market.",
  },
  industriesTitle: { line1: "Powering local businesses", line2: "to own their market." },
  industries: [
    "Home Services",
    "HVAC & Plumbing",
    "Healthcare & Dental",
    "Legal",
    "Real Estate",
    "E-Commerce",
    "Professional Services",
  ],
  cta: {
    title: "Let's make your competitors nervous.",
    description:
      "Book a free 30-minute strategy call. You'll leave with a clear picture of where your growth is hiding.",
  },
};

import type { StaticImageData } from "next/image";

import elixirDesktop from "@/assets/portfolio/elixir-desktop.jpg";
import elixirMobile from "@/assets/portfolio/elixir-mobile.jpg";
import exclusiveDesktop from "@/assets/portfolio/exclusive-desktop.jpg";
import exclusiveMobile from "@/assets/portfolio/exclusive-mobile.jpg";
import speedycareDesktop from "@/assets/portfolio/speedycare-desktop.jpg";
import speedycareMobile from "@/assets/portfolio/speedycare-mobile.jpg";

export type PortfolioProject = {
  name: string;
  url: string;
  industry: string;
  summary: string;
  highlights: string[];
  /** Tall top-of-page captures (desktop 1440px wide, mobile 390px @2x); see docs/06 for how to refresh. */
  desktop: StaticImageData;
  mobile: StaticImageData;
};

export const portfolio: PortfolioProject[] = [
  {
    name: "Elixir Muscle Recovery",
    url: "https://elixirmuscle.com/",
    industry: "Sports recovery · Multi-location, USA",
    summary:
      "A bold, high-energy site for a sports-recovery brand with locations across Texas — built to turn local searches into booked sessions.",
    highlights: ["Location finder", "Free-trial booking", "Franchise enquiries"],
    desktop: elixirDesktop,
    mobile: elixirMobile,
  },
  {
    name: "The Agency",
    url: "https://ourexclusiveagency.com/",
    industry: "Executive matchmaking",
    summary:
      "An elegant, editorial brand experience for an exclusive matchmaking agency — calm typography and warm gold accents that signal discretion and quality.",
    highlights: ["Premium brand feel", "Separate application paths", "Booking-first layout"],
    desktop: exclusiveDesktop,
    mobile: exclusiveMobile,
  },
  {
    name: "Speedy Care Health",
    url: "https://speedycare.com.au/",
    industry: "NDIS disability services · Melbourne, Australia",
    summary:
      "A warm, trust-first site for a registered NDIS provider, designed so participants and families can find services and get in touch easily.",
    highlights: ["Accessibility toolbar", "Service booking", "Referral flow"],
    desktop: speedycareDesktop,
    mobile: speedycareMobile,
  },
];

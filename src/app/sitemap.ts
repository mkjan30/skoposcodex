import type { MetadataRoute } from "next";

import { services, site } from "@/content/site";

// /onboard, /dev and (later) /admin are intentionally left out.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/process", "/why-us", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${site.url}/services/${s.slug}`, priority: 0.9 })),
  ];
}

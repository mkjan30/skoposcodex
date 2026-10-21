import { branding } from "./branding";
import { funnelBuilding } from "./funnel-building";
import { localSeo } from "./local-seo";
import { ppc } from "./ppc";
import type { ServiceContent } from "./types";
import { websiteDesign } from "./website-design";

export const serviceContent: Record<string, ServiceContent> = {
  [localSeo.slug]: localSeo,
  [ppc.slug]: ppc,
  [branding.slug]: branding,
  [websiteDesign.slug]: websiteDesign,
  [funnelBuilding.slug]: funnelBuilding,
};

import { renderOgImage, ogSize } from "@/lib/og-image";
import { site } from "@/content/site";

export const alt = `${site.name} — digital marketing agency for local businesses`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return renderOgImage({ eyebrow: "Digital growth agency", title: site.tagline });
}

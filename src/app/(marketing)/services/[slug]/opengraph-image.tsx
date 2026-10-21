import { renderOgImage, ogSize } from "@/lib/og-image";
import { serviceContent } from "@/content/services";
import { services } from "@/content/site";

export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = serviceContent[slug];
  return renderOgImage({ eyebrow: c.hero.eyebrow, title: `${c.hero.title} ${c.hero.highlight}` });
}
